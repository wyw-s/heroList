const express = require('express')
const connection = require('../utils/mysql')
const router = express.Router()

const createUserTable = `
CREATE TABLE IF NOT EXISTS users(
  Id INT auto_increment PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) 
)`

// 创建用户表
connection().query(createUserTable)

// 用户注册；
router.post('/register', (request, response) => {
  const { username } = request.body
  // 查询是否已被注册；
  connection().query('SELECT * FROM users WHERE username = ?', username, (error, results) => {
    if (!error) {
      if (!results.length) {
        // 注册；
        connection().query('INSERT INTO users SET ?', request.body, (error) => {
          if (!error) {
            response.send({
              code: 200,
              success: true,
              message: '注册成功'
            })
          } else {
            response.send({
              code: 500,
              success: false,
              message: '注册失败'
            })
          }
        })
      } else {
        response.send({
          code: 401,
          success: true,
          message: '该账号已被注册！'
        })
      }
    } else {
      response.send({
        code: 500,
        success: false,
        message: '内部错误'
      })
    }
  })
})

module.exports = router
