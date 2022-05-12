import Vue from 'vue'
import Vuex from 'vuex'

import { fetchActions } from '@/rest'
import {
  exchangeAccessCode,
  getUserData,
  goToSpeckleAuthPage,
  speckleLogOut,
} from '@/speckleUtils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    serverInfo: null,
    actions: null,
  },
  getters: {
    isAuthenticated: (state) => state.user != null,
  },
  mutations: {
    setActions(state, actions) {
      state.actions = actions
    },
    setUser(state, user) {
      state.user = user
    },
    setServerInfo(state, info) {
      state.serverInfo = info
    },
  },
  actions: {
    logout(context) {
      // Wipe the state
      context.commit('setUser', null)
      context.commit('setServerInfo', null)
      // Wipe the tokens
      speckleLogOut()
    },
    exchangeAccessCode(context, accessCode) {
      // Here, we could save the tokens to the store if necessary.
      return exchangeAccessCode(accessCode)
    },
    async getActions(context) {
      if (!context.state.actions) {
        try {
          const data = await fetchActions().then((json) => json.data)
          context.commit('setActions', data)
        } catch (error) {
          console.log(error)
        }
      }
      return context.state.actions
    },
    async getUser(context) {
      try {
        const json = await getUserData()
        const data = json.data
        context.commit('setUser', data.user)
        context.commit('setServerInfo', data.serverInfo)
      } catch (err) {
        console.log(err)
      }
    },
    redirectToAuth() {
      // use speckleUtils redirect logic
      goToSpeckleAuthPage()
    },
  },
  modules: {},
})
