const express = require('express')
const bodyParser = require('body-parser')

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
  response.header('Access-Control-Allow-Origin', "*")
  next()
})

// 加载接口；
app.use('/hero', require('./router/heroManage.js'))

// 启动服务；
app.listen(3000, (err) => {
  if (!err) {
    console.log('server started on port 3000')
  }
})
