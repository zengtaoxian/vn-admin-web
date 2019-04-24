import Cookies from 'js-cookie'

let cook = {
  get: (name) => {
    return Cookies.get(name)
  },
  set: (name, value) => {
    return Cookies.set(name, value)
  },
  remove: (name) => {
    return Cookies.remove(name)
  }
}

export default {
  install: function(vm) {
    vm.prototype.$cook = cook
  }
}
