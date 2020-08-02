const express = require('express')
// const connection = require('../utils/mysql')
const router = express.Router()

// 登录；
router.post('/login', (request, response) => {
  response.send({
    code: 500,
    success: false,
    message: '获取数据失败'
  })
})
