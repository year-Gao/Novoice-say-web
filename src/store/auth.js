import Vue from 'vue'

export const auth = Vue.observable({
  isLoggedIn: false
})

export const authMethods = {
  setLoginStatus(status) {
    auth.isLoggedIn = status
  }
} 