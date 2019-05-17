import Cookies from 'js-cookie'

// consts
const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'
const CLOSE_SIDEBAR = 'CLOSE_SIDEBAR'
const TOGGLE_DEVICE = 'TOGGLE_DEVICE'

// states
const state = {
  sidebar: {
    opened: !+Cookies.get('sidebarStatus'),
    withoutAnimation: false
  },
  device: 'desktop'
}

// getters
const getters = {
  sidebar: state => state.sidebar,
  device: state => state.device
}

// mutations
const mutations = {
  TOGGLE_SIDEBAR: state => {
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 1)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

// actions
const actions = {
  ToggleSideBar: ({ commit }) => {
    commit(TOGGLE_SIDEBAR)
  },
  CloseSideBar({ commit }, { withoutAnimation }) {
    commit(CLOSE_SIDEBAR, withoutAnimation)
  },
  ToggleDevice({ commit }, device) {
    commit(TOGGLE_DEVICE, device)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
