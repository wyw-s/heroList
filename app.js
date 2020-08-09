const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken');
// 创建服务器；
const app = express()

// 托管静态资源；
app.use(express.static('uploads'))
// 解析 application/json
app.use(bodyParser.json())
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// 设置允许跨域
app.use((request, response, next) => {
  // 跨域服务器允许的来源地址,可以是*或者某个确切的地址，不允许多个地址。
  response.header('Access-Control-Allow-Origin', "*")
  // 跨域服务器允许的请求方法。
  response.header("Access-Control-Allow-Headers", "*")
  // 跨域服务器允许客户端添加或自定义哪些http 头。
  response.header('Access-Control-Allow-Methods', "POST, GET, PATCH, DELETE, PUT, OPTIONS")
  next()
})

// 统一登录认证;
app.use('/hero/*', (request, response, next) => {
  jwt.verify(request.headers.authorization, 'token', function(err) {
    if (err) {
      response.send({
        code: 401,
        message: '认证失败，请重新登录！'
      })
    } else {
      next()
    }
  })
})

// 加载接口；
app.use('/hero', require('./router/heroManage.js'))
app.use('/user', require('./router/login.js'))

// 统一处理错误
app.use((err, req, res, next) => {
  console.log('serveError:', err)
  next()
})

// 启动服务；
app.listen(3000, (err) => {
  if (!err) {
    console.log('server started on port 3000')
  }
})
