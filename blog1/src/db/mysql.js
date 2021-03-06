const mysql = require('mysql')
const { MYSQL_CONF } = require('../conf/db')

// 创建连接对象
// 普通连接
let db = mysql.createConnection(MYSQL_CONF)

// 开始连接
db.connect()

// 统一执行sql的函数
function exec(sql) {
  let promise = new Promise(function selectCb(resolve, reject) {
    db.query(sql, (err, result) => {
      if(err) {
        reject(err)
      }
      resolve(result)
    })
  })
  return promise
}
module.exports = {
  exec
}