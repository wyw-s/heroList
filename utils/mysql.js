const mysql = require('mysql')

const sqlConfig = {
  host: 'localhost', // 数据库地址
  port: '3306',
  user: 'root',
  password: 'WANGyawei@520',
  database: 'heroList' // 数据库名称
}

/**
 * 此种方式虽然解决了由于mysql(wait_timeout)连接超时导致的 connection 断开，
 * 但是也引入了新的问题，就是不能获取到最新的连接，此时会报 Cannot enqueue Query after fatal error.
 * 所以不能把 connection 作为全局变量导出。
 * 解决的办法是：导出一个封装好的函数，然后在每次请求来时，进行获取最新的连接。
 * 同时这也引入了新的问题就是，每次请求都会建立一次连接,所以要设置 wait_timeout 时间，可以把超时时间设置的断些，
 * 这样就不会因为过多的连接导致 产生过多的 sleep 连接了
 */
function handleDisconnection() {
  // 创建链接
  var connection = mysql.createConnection(sqlConfig)
  // 链接数据库
  connection.connect(function (err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
    } else {
      console.log('connection success')
    }
  })

  // 监听错误事件
  connection.on('error', function (err) {
    console.error('mysql error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('mysql error执行重连:' + err.message)
    } else {
      throw err
    }
  })
  return connection
}

module.exports = handleDisconnection
