const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.login.token,
  avatar: state => state.login.avatar,
  name: state => state.login.name,
  roles: state => state.login.roles
}
export default getters
