import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/new',
    name: 'Create New Workflow',

    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/WorkflowEditor.vue'),
  },
  {
    path: '/:workflow',
    name: 'Workflow Detail',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "runs" */ '../views/WorkflowRuns.vue'),
  },
  {
    path: '/:workflow/edit',
    name: 'Edit Workflow',

    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/WorkflowEditor.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.query.access_code) {
    // If the route contains an access code, exchange it
    try {
      await store.dispatch('exchangeAccessCode', to.query.access_code)
      await store.dispatch('getUser')
    } catch (err) {
      console.warn('exchange failed', err)
    }
    // Whatever happens, go home.
    next('/')
  } else {
    try {
      // Check on every route change if user has still access
      const goto = await store.dispatch('getUser')
      next(goto)
    } catch (err) {
      next('/')
    }
  }
})

export default router
