const mysql = require('mysql')

const sqlConfig = {
  host: 'localhost', // 数据库地址
  port: '3306',
  user: 'root',
  password: 'WANGyawei@520',
  database: 'heroList' // 数据库名称
}

function handleDisconnection() {
  // 创建链接
  var connection = mysql.createConnection(sqlConfig)
  // 链接数据库
  connection.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      setTimeout(handleDisconnection, 2000)
    } else {
      console.log('connection success')
    }
  })

  // 监听错误事件
  connection.on('error', function (err) {
    console.error('mysql error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('mysql error执行重连:' + err.message)
      handleDisconnection()
    } else {
      throw err
    }
  })
  return connection
}

module.exports = handleDisconnection()
