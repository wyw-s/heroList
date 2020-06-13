const mysql = require('mysql')

// 创建链接
var connection = mysql.createConnection({
  host: 'localhost', // 数据库地址
  port: '3306',
  user: 'root',
  password: 'root',
  database: 'heroList' // 数据库名称
})

// 链接数据库
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack)
    return
  }
  console.log('connection success')
})

module.exports = connection