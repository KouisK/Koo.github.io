import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Authorization: localStorage.getItem("token")
      ? localStorage.getItem("token")
      : ""
  },
  mutations: {
    changeLogin(state, user) {
      state.Authorization = user.Authorization;
      localStorage.setItem("token", user.Authorization);
    }
  },
  actions: {},
  modules: {}
});
