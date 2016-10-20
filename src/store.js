import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    incrementAsync ({commit, state}, payload) {
      // setTimeout(() => {
      //   commit('increment',payload.amount)
      // }, 1000)
      commit('increment')
    }
  }
})
