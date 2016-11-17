import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    show: true,
    message: 1
  },
  methods: {
    // chgShow : () =>{} == chgShow : function chgShow(){} error
    chgShow () { // chgShow:function(){} success
      // console.log(this)
      // this.show = !this.show
      this.message++
    }
  },
  render (h) {
    if (this.show) {
      // console.log(this.show)
      return (
        <div>
          hello, world!{this.message}
          <input type='text' value={this.message}/>
          <button on-click={this.chgShow.bind(this)}>test</button>
        </div>
      )
    } else {
      return (
        <div>
          <button on-click={this.chgShow}>test</button>
          <App />
        </div>
      )
    }
  },
  components: { App },
  router,
  store
})
