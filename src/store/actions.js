import * as types from './types'

export default {
  hideLoading: ({commit}) => {
    commit(types.HIDE_LOADING)
  },
  showLoading: ({commit}) => {
    commit(types.SHOW_LOADING)
  },
  setPermissionsns:({commit})=>{
    commit(types.SET_PERMISSIONSNS)
  }

}
