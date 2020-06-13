const express = require('express')
const bodyParser = require('body-parser')

// 创建服务器；
const app = express()

// 解析 Post 请求的 body 主体，application/json
app.use(bodyParser.json())

// 加载接口；
app.use('/hero', require('./router/heroManage.js'))

// 启动服务；
app.listen(3000, (err) => {
  if (!err) {
    console.log('server started on port 3000')
  }
})