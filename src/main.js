import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  data: {
    show: true,
    message: 'test123'
  },
  methods: {
    chgShow: (e) => {
      vm.show = !vm.show
      console.log(vm.show)
      console.log(e)
    }
  },
  render (h) {
    if (this.show) {
      // console.log(this.show)
      return (
        <div>
          hello, world!
          <button on-click={this.chgShow}>test</button>
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
