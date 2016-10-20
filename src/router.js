import Vue from 'vue'
import VueRouter from 'vue-router'
import Hello from 'components/Hello'

const Bar = {
  template: '<div>bar {{ $route.params.id }}</div>'
}

const routes = [
  { path: '/', component: Hello },
  { path: '/bar/:id', component: Bar }
]

Vue.use(VueRouter)

const router = new VueRouter({
  routes // same with routes: routes
})

export default router
