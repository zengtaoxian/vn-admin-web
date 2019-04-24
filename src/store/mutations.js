import * as types from "./types";




const mutations = {
  [types.HIDE_LOADING](state) {
    state.loading = false;
  },
  [types.SHOW_LOADING](state) {
    state.loading = true;
  },
  [types.LOGIN](state, data) {
    let obj = JSON.parse(data);
    state.token = obj.token;
    state.roleId = obj.roleId;
    window.localStorage.setItem('TOKEN', data);
  },
  [types.LOGINOUT](state) {
    state.token = null;
    window.localStorage.removeItem('TOKEN');
  },
  [types.SET_PERMISSIONSNS](state,data){
    state.permissionsList = data;
  }
}

export default mutations






