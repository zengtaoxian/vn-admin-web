import { param2Obj } from './utils'

const data =
  [
    {
      id: '1',
      name: 'client1',
      email: 'client1@163.com',
      mobile: '13828772871',
      balance: '100',
      overdraft: '0',
      createUser: 'client1',
      createTime: '2018-09-01',
      updateTime: '2018-10-01'
    },
    {
      id: '2',
      name: 'client2',
      email: 'client2@163.com',
      mobile: '13828772871',
      balance: '1000',
      overdraft: '10',
      createUser: 'client2',
      createTime: '2018-09-01',
      updateTime: '2018-10-01'
    }
  ]

export default {
  addInfo: req => {
    const dataReq = JSON.parse(req.body)
    const name = dataReq['name']

    if (name === 'client1') {
      return {
        code: 0,
        data: data,
        pageNum: 10,
        pageNo: 1,
        total: 2
      }
    } else {
      return {
        code: 1,
        desc: 'param is error.'
      }
    }
  },
  delInfo: req => {
    const { id } = JSON.parse(req.body)
    if (id === 1) {
      return {
        code: 0,
        data: data,
        pageNum: 10,
        pageNo: 1,
        total: 2
      }
    } else {
      return {
        code: 1,
        desc: 'param is error.'
      }
    }
  },
  mdfInfo: req => {
    const dataReq = JSON.parse(req.body)
    const name = dataReq['name']
    if (name === 'client1') {
      return {
        code: 0,
        data: data,
        pageNum: 10,
        pageNo: 1,
        total: 2
      }
    } else {
      return {
        code: 1,
        desc: 'param is error.'
      }
    }
  },
  getInfo: req => {
    const { id } = JSON.parse(req.body)
    if (id === 1) {
      return {
        code: 0,
        data: data[0],
        pageNum: 10,
        pageNo: 1,
        total: 2
      }
    } else {
      return {
        code: 1,
        desc: 'param is error.'
      }
    }
  },
  getList: req => {
    return {
      code: 0,
      data: data,
      pageNum: 10,
      pageNo: 1,
      total: 2
    }
  }
}
