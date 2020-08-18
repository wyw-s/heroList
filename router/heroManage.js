const express = require('express')
const moment = require('moment')
const connection = require('../utils/mysql')
const fs = require('fs')
const router = express.Router()

const createHeroTable = `
CREATE TABLE IF NOT EXISTS heros(
  Id INT auto_increment PRIMARY KEY,
  images VARCHAR(255),
  nickName VARCHAR(255),
  userName VARCHAR(255),
  date VARCHAR(255),
  intro VARCHAR(255)
)`

// 创建hero表
connection(createHeroTable)
// 文件上传
const multer = require('multer')
// 自定义上传储存位置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    // 获取文件后缀
    const fileFormat = file.originalname.split('.')
    // 设置文件名
    cb(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1])
  }
})
const upload = multer({ storage: storage })

/**
 * 设计路由；
 */
// 查询英雄列表
router.get('/getlist', (request, response, next) => {
  // 'SELECT * FROM heros' 查询表 heros的全部内容
  // 'SELECT * FROM heros ORDER BY Id asc/desc' 正序/倒序查询
  connection('SELECT * FROM heros ORDER BY Id desc', function(err, rows) {
    if (!err) {
      response.send({
        code: 200,
        success: true,
        heroList: rows
      })
    } else {
      response.send({
        code: 500,
        success: false,
        message: '获取数据失败'
      })
      next(err)
    }
  });
})

// 查询英雄详情
router.get('/detail', (request, response) => {
  // 'select id from heros where id' 查询表中某个字段的全部内容。
  // 'select * from heros where id = ' 根据id 进行精确查询。
  connection('select * from heros where id = ?', request.query.id, function(err, rows) {
    if (err) throw err
    response.send({
      code: 200,
      success: true,
      data: rows[0] || null
    })
  });
})

// 新增英雄；
router.post('/add', upload.single('images'), (request, response, next) => {
  let params;
  if (request.file) {
    params = {
      images: request.file.filename,
      date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      ...request.body
    }
  }
  // 向表中插入一条数据；
  const sql = "INSERT INTO heros set ?";
  connection(sql, params, function(err) {
    if (!err) {
      response.send({
        success: true,
        code: 200,
        message: '恭喜你新增成功'
      })
    } else {
      response.send({
        code: 500,
        success: false,
        message: '新增英雄失败'
      })
      next(err)
    }
  });
})

// 删除英雄；
router.delete('/delete', (request, response, next) => {
  // 根据id删除某一条数据；
  const { id, images } = request.body
  const sql = "DELETE FROM heros WHERE id = ?";
  connection(sql, id, function(err) {
    if (!err) {
      response.send({
        success: true,
        code: 200,
        message: '删除成功'
      })
      const index = __dirname.lastIndexOf('\\')
      fs.unlink(`${__dirname.substr(0 ,index + 1)}uploads\\${images}`, function(err){
        if(err){
          next(err)
        }
      })
    } else {
      response.send({
        code: 500,
        success: false,
        message: '删除失败'
      })
      next(err)
    }
  });
})

// 编辑英雄；
router.put('/updata',upload.single('img'), (request, response, next) => {
  if (request.file) {
    request.body.img = request.file.filename
  }
  const body = request.body
  const arr = []
  for (let Key in body) {
    arr.push(body[Key])
  }
  arr.push(...arr.splice(0, 1))
  // 根据id修改某一条数据；
  const sql = "update heros set name = ?, skill = ?, img = ? where id = ?";
  connection.query(sql, arr, function(err) {
    if (!err) {
      response.send({
        success: true,
        code: 200,
        message: '编辑成功'
      })
    } else {
      response.send({
        code: 500,
        success: false,
        message: '编辑失败'
      })
      next(err)
    }
  });
})

module.exports = router;
