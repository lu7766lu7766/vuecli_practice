import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import JsPDF from 'jspdf'
import JsBarcode from 'jsbarcode'

import config from '../config/default'

import firebase from 'firebase'

import Cookies from 'js-cookie'

import twRules from '../config/tw_phone_rule'

import _ from 'lodash'
import $ from 'jquery'

const conf = config.Firebase.config

firebase.initializeApp(conf)
var db = firebase.database()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    show: true,
    message: 1,
    userId: '',
    users: {},
    login_msg: {},
    countryCode: '0',
    countrySelect: {
      '0': 'Taiwan',
      '1': 'China'
    },
    twRules,
    searchNumber: '',
    limitLen: -1,
    numberSelectDefault: ['', '?', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    numberSelectList: [],
    numberLimitLen: -1,
    numberLimitLenList: []
  },
  methods: {
    // chgShow : () =>{} == chgShow : function chgShow(){} error
    chgShow () { // chgShow:function(){} success
      // console.log(this)
      this.show = !this.show
      this.message++
    },
    // don't just call login ,it will be error
    googleLogin () {
      var provider = new firebase.auth.GoogleAuthProvider()
      provider.addScope('https://www.googleapis.com/auth/plus.login')
      firebase.auth().signInWithPopup(provider).then(function (result) {
        var token = result.credential.accessToken
        var user = result.user      // 使用者資訊
        console.log('token: ' + token)
        console.log('user: ' + user)
        Cookies.set('login_msg', {token, user})
        this.login_msg = {token, user}
      }.bind(this)).catch(function (error) {
        // 處理錯誤
        var errorCode = error.code
        // var errorMessage = error.message
        // var email = error.email      // 使用者所使用的 Email
        // var credential = error.credential
        console.log('errorCode:' + errorCode)
      })
    },
    add () {
      var postData = {
        user_id: this.userId
      }
      var newPostKey = firebase.database().ref('users').push().key
      var updates = {}
      updates['/posts/' + newPostKey] = postData
      db.ref().update(updates)
      // db.ref('users').push({
      //   user_id: this.userId
      // })
    },
    get () {
      // console.log(Cookies.get('login_msg'))
      this.users = db.ref('users').on('value', function (snapshot) {
        console.log(snapshot.val())
      })
    },
    logout () {
      Cookies.remove('login_msg')
      this.login_msg = {}
    },
    chgCountry () {
      this.searchNumber = ''
      this.numberSelectList = []
      this.checkPhone(0)
    },
    setPhone (index, event) {
      var len = index + 1
      this.searchNumber = this.searchNumber.substr(0, index)
      this.numberSelectList = this.numberSelectList.splice(0, len)
      this.searchNumber += event.target.value
      this.checkPhone(len)
    },
    checkPhone (len) {
      // 預設國碼開頭
      if (len === 0) {
        if (this.countryCode === '0') {
          this.searchNumber = '0'
          this.numberSelectList.push(['0'])
        } else if (this.countryCode === '1') {
          this.searchNumber = '86'
          this.numberSelectList.push(['8'])
          this.numberSelectList.push(['6'])
        }
      }
      var numberCurrent = ['', '?']
      this.numberLimitLenList = []

      if (this.countryCode === '0') {
        _.forEach(this.twRules, function (val, key) {
          if (key.startsWith(this.searchNumber) && key.length >= this.searchNumber.length) {
            numberCurrent.push(key.substr(this.searchNumber.length, 1))
            this.numberLimitLenList.push(parseInt(val))
          }
        }.bind(this))
      } else if (this.countryCode === '1') { }
      // console.log(this.numberLimitLenList)

      // 移除重複
      numberCurrent = this.removeRepeat(numberCurrent)
      this.numberLimitLenList = this.removeRepeat(this.numberLimitLenList)

      // 如果沒有match到
      if (numberCurrent.length === 2) {
        numberCurrent = _.clone(this.numberSelectDefault)
      }
      // 比對到多個長度，取最大值
      if (this.numberLimitLenList.length > 0) {
        this.numberLimitLen = _.max(this.numberLimitLenList)
      }
      // 如果號碼長度小於最終長度
      if (this.numberSelectList.length < this.numberLimitLen) {
        this.numberSelectList.push(numberCurrent)
        this.$nextTick(function () {
          $('.numberSelect:last').val('')
        })
      }
    },
    removeRepeat (list) {
      return list.filter(function (el, i, arr) {
        return arr.indexOf(el) === i
      })
    }
  },
  computed: { },
  template: `
    <div>
      <input type="text" v-model="userId"/>
      <button @click="googleLogin" v-if="!login_msg.token">Login</button>
      <button @click="add">Add</button>
      <button @click="get">Get</button>
      <button @click="logout" v-if="login_msg.token">Logout</button>
      {{userId}}

      <div id="searchNumber">
        <div>
          {{searchNumber}}-{{numberLimitLen}}
          <select v-model="countryCode" @change="chgCountry">
            <option v-for="(country, code) in countrySelect" :value="code">{{country}}</option>
          </select>
        </div>
        <select v-for="(numberSelect, index) in numberSelectList" @change="setPhone(index, $event)" class="numberSelect">
          <option v-for="s in numberSelect">{{s}}</option>
        </select>
      </div>
      <div v-if="show">
        hello, world!{{this.message}}<br>
      </div>
      <div v-else>
        bad world!!{{this.message}}<br>
      </div>
      <input type='text' v-model="message"/><br>
      <button @click="show = !show">test</button>
      <img id="barcode" style="width:100px;height:30px"/>
    </div>
  `, // <App />
  mounted () {
    this.$nextTick(function () {
      // 保证 this.$el 已经插入文档
      JsBarcode('#barcode', 'Ji!')
      // or with jQuery
      // document.getElementsByTagId('barcode').JsBarcode('Hi!')

      if (typeof Cookies.get('login_msg') !== 'undefined') {
        this.login_msg = JSON.parse(Cookies.get('login_msg'))
      }

      this.chgCountry(0)
    })
  },
  // render (h) {
  //   if (this.show) {
  //     // console.log(this.show)
  //     return (
  //       <div>
  //         hello, world!{this.message}
  //         <input type='text' value={this.message}/>
  //         <button on-click={this.chgShow.bind(this)}>test</button>
  //       </div>
  //     )
  //   } else {
  //     return (
  //       <div>
  //         <button on-click={this.chgShow}>test</button>
  //         <App />
  //       </div>
  //     )
  //   }
  // },
  components: { App },
  router,
  store
})
