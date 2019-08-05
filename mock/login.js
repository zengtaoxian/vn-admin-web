import { param2Obj } from './utils'

const userIds = {
  admin: {
    userId: '11f2b49c-f20c-4a47-a10a-843ace1e5a54'
  },
  editor: {
    userId: '11f2b49c-f20c-4a47-a10a-843ace1e5a76'
  }
}

const users = {
  '11f2b49c-f20c-4a47-a10a-843ace1e5a54': {
    userId: "11f2b49c-f20c-4a47-a10a-843ace1e5a54",
    userName: "admin",
    sex: "男",
    email: "root@renren.io",
    mobile: "13612345678",
    status: 1,
    roleList: [
      {
        roleId: 1,
        roleName: "admin"
      }
    ],
    createTime: "2016-11-11 19:11:11",
    updateTime: "2017-11-11 19:11:11",
    userLevel: "admin"
  },
  '11f2b49c-f20c-4a47-a10a-843ace1e5a76': {
    userId: "11f2b49c-f20c-4a47-a10a-843ace1e5a76",
    userName: "editor",
    sex: "女",
    email: "root@renren.io",
    mobile: "13612345678",
    status: 1,
    roleList: [
      {
        roleId: 1,
        roleName: "editor"
      }
    ],
    createTime: "2016-11-11 19:11:11",
    updateTime: "2017-11-11 19:11:11",
    userLevel: "editor"
  }
}

export default {
  login: req => {
    const { username } = JSON.parse(req.body)
    const data = userIds[username]

    if (data) {
      return {
        code: 0,
        data: data
      }
    }
    return {
      code: 60204,
      message: 'Account and password are incorrect.'
    }
  },
  getInfo: req => {
    const { userId } = param2Obj(req.url)
    const info = users[userId]

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
