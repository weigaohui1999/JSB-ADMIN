import { createStore } from "vuex";
import { message } from "ant-design-vue";

import { GET_MENU } from "@a/menu";
import Utils from "@u/Utils";
import { GET_CURRENT } from '../api/user.js'

export default createStore({
  state: {
    routers: [],
    breadcrumb: [],
    userinfo: {}
  },
  getters: {},
  mutations: {
    SET_ROUTERS(state, value) {
      state.routers = value;
    },
    SET_BREADCRUMB(state, value) {
      state.breadcrumb = value;
    },
    SET_USERINFO(state, data) {
      state.userinfo = {...data}
    }
  },
  actions: {
    menu({ commit }) {
      return new Promise(async (resolve, reject) => {
        const res = await GET_MENU();
        if (res.code == 200) {
          let data = Utils.setRouterInfo(res.data, "吉顺办-");
          commit("SET_ROUTERS", data);
          resolve(data);
        } else {
          commit("SET_USERINFO", {})
          message.warning("菜单配置异常,请重新登录!");
          window.sessionStorage.clear();
          window.location.href = "/login";
        }
      });
    },
    setUserinfo({commit}) {
      return new Promise(async (resolve, reject)=> {
        const res = await GET_CURRENT()
        if (res.code == 200) {
          commit('SET_USERINFO', res.data)
          resolve(res.data);
        } else {
          reject(new Error(res.message))
        }
      })
    }
  },
  modules: {},
});
