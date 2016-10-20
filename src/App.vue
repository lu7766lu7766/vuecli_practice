<template>
  <div id="app">
    <router-link to="/">Hello</router-link> 
    <router-link to="/bar/123">Go to Bar</router-link>
    <img src="./assets/logo.png">
    <button @click="countAdd">+1</button>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    countAdd () {
      this.$store.dispatch({
        type: 'incrementAsync'
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
