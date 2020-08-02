const express = require('express')
// const connection = require('../utils/mysql')
const router = express.Router()

// 登录；
router.post('/login', (request, response) => {
  console.log('====0000====')
  response.send({
    code: 500,
    success: true,
    message: '登录失败'
  })
})

module.exports = router;
