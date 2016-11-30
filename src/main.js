import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import JsPDF from 'jspdf'
import JsBarcode from 'jsbarcode'

import config from '../config/default'

import firebase from 'firebase'

import Cookies from 'js-cookie'

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
    login_msg: {}
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
    }
  },
  computed: {
  },
  template: `
    <div>
      <input type="text" v-model="userId"/>
      <button @click="googleLogin" v-if="!login_msg.token">Login</button>
      <button @click="add">Add</button>
      <button @click="get">Get</button>
      <button @click="logout" v-if="login_msg.token">Logout</button>
      {{userId}}
      <div v-if="show">
        hello, world!{{this.message}}<br>
      </div>
      <div v-else>
        bad world!!{{this.message}}<br>
      </div>
      <input type='text' v-model="message"/><br>
      <button @click="show = !show">test</button>
      <img id="barcode"/>
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
