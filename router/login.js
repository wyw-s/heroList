const express = require('express')
const connection = require('../utils/mysql')
const svgCaptcha = require('svg-captcha');

const router = express.Router()

const createUserTable = `
CREATE TABLE IF NOT EXISTS users(
  Id INT auto_increment PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) 
)`

// 创建用户表
connection(createUserTable)

// 用户注册；
router.post('/register', (request, response, next) => {
  const { username } = request.body
  // 查询是否已被注册；
  connection('SELECT * FROM users WHERE username = ?', username, (error, results) => {
    if (!error) {
      if (!results.length) {
        // 注册；
        connection('INSERT INTO users SET ?', request.body, (error) => {
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
            next(error)
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
      next(error)
    }
  })
})

// 用户登录;
let captchaText = ''
router.post('/login', (request, response, next) => {
  const { username, password, captcha } = request.body
  // 查找用户;
  connection('SELECT * FROM users WHERE username = ?',username, (error, results) => {
    if (error) {
      response.send({
        code: 500,
        success: true,
        message: '服务器内部错误'
      })
      next(error)
    } else {
      if (results.length) {
        if (captcha === captchaText ) {
          if (results[0].password === password) {
            response.send({
              code: 200,
              success: true,
              message: '恭喜你！登录成功',
              data: {
                accessToken: results
              }
            })
          } else {
            response.send({
              code: 402,
              success: false,
              message: '账号或密码错误，请重新登录'
            })
          }
        } else {
          response.send({
            code: 402,
            success: false,
            message: '验证码错误，请重新登录'
          })
        }
      } else {
        response.send({
          code: 400,
          success: false,
          message: '该账号未注册，请先进行注册！',
        })
      }
    }
  })
})

// 验证码；
router.get('/captcha', function (request, response) {
  const captcha = svgCaptcha.createMathExpr({
    mathMin: -9,
    mathMax: 9,
    noise: 3,
    color: true
  })
  captchaText = captcha.text;
  response.type('svg');
  response.send(captcha.data)
});

module.exports = router
