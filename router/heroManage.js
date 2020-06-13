const express = require('express')
const connection = require('../utils/mysql')
const router = express.Router()

/**
 * 设计路由；
 */
// 查询英雄列表
router.get('/list', (request, response) => {
  // 'SELECT * FROM hero' 查询表 hero的全部内容
  connection.query('SELECT * FROM hero', function(err, rows) {
    if (err) throw err
    response.send(rows)
  });
})

// 新增英雄；
router.post('/add', (request, response) => {
  // 向表中插入一条数据；
  const sql = "INSERT INTO hero set ?";
  connection.query(sql, request.body, function(err) {
    if (err) {
      console.log('新增英雄失败！')
    } else {
      response.send({
        success: true,
        code: 200,
        message: '新增英雄成功'
      })
    }
  });
})

module.exports = router;