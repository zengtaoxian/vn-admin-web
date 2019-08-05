import Mock from 'mockjs'
import loginAPI from './login'
import tableAPI from './table'
import clientAPI from './client'

// Fix an issue with setting withCredentials = true, cross-domain request lost cookies
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}
// Mock.setup({
//   timeout: '350-600'
// })

// User
Mock.mock(/\/login/, 'post', loginAPI.login)
Mock.mock(/\/user\/info/, 'post', loginAPI.getInfo)
Mock.mock(/\/logout/, 'post', loginAPI.logout)

// Table
Mock.mock(/\/table\/list/, 'get', tableAPI.list)

// Client
Mock.mock(/\/client\/add/, 'post', clientAPI.addInfo)
Mock.mock(/\/client\/del/, 'post', clientAPI.delInfo)
Mock.mock(/\/client\/mdf/, 'post', clientAPI.mdfInfo)
Mock.mock(/\/client\/info/, 'post', clientAPI.getInfo)
Mock.mock(/\/customer\/list/, 'post', clientAPI.getList())

export default Mock
