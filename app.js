// 导包；
const express = require('express')

// 创建服务器；
const app = express()

// 设计路由；
app.get('/', (request, response)=> {
  response.send('haha')
})

// 启动服务；
app.listen(3000, (err)=>{
  if (!err) {
    console.log('success')
  }
})