//引入mockjs
const Mock = require('mockjs')

const produceNewsData = {
  a: '1',
  b: '2'
}

//Mock.mock( url, post/get , 返回的数据)；
Mock.mock('/vaaw/index', 'post', produceNewsData)
