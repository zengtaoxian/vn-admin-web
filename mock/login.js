import { param2Obj } from './utils'

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super1'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal2'
  }
}

export default {
  login: req => {
    const { username } = JSON.parse(req.body)
    const data = tokens[username]

    if (data) {
      return {
        code: 0,
        data
      }
    }
    return {
      code: 60204,
      message: 'Account and password are incorrect.'
    }
  },
  getInfo: req => {
    const { token } = param2Obj(req.url)
    const info = users[token]

    if (info) {
      return {
        code: 0,
        data: info
      }
    }
    return {
      code: 50008,
      message: 'Login failed, unable to get user details.'
    }
  },
  logout: () => {
    return {
      code: 0,
      data: 'success'
    }
  }
}
