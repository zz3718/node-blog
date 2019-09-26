// 程序运行第二层：基础设置
const querystring = require('querystring') // querystring：node提供的原生解析query的方法
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 处理postdata
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if(req.method !== 'POST') {
      resolve({})
      return
    }
    if(req.headers['content-type'] !== 'application/json') {
      resolve({})
      return
    }
    let postData = ''
    req.on('data', chunk => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      if(!postData) {
        resolve({})
        return
      } 
      resolve(
        JSON.parse(postData)
      )     
    })
  })
  return promise
}

const serverHandle = (req, res) => {
  // 设置返回格式json
  res.setHeader('Content-type', 'application/json')
  const url = req.url
  req.path = url.split('?')[0]

  // 解析query
  req.query = querystring.parse(url.split('?')[1])

  // 处理postdata
  getPostData(req).then(postData => {
    req.body = postData
    // console.log(req)
    // console.log(res)
    // 处理blog路由
    // const blogResult = handleBlogRouter(req, res)
    // if(blogResult) {
    //   blogResult.then(blogData => {
    //     res.end(
    //       JSON.stringify(blogData)
    //     )
    //     return
    //   })
    // }
    const blogData = handleBlogRouter(req, res)
    if(blogData) {
      res.end(
        JSON.stringify(blogData)
      )
      return
    }

    // 处理user路由
    const userData = handleUserRouter(req, res)
    if(userData) {
      res.end(
        JSON.stringify(userData)
      )
      return
    }

    // 未命中路由返回404
    res.writeHead(404, {"Content-type": "text/plain"})
    res.write("404 Not Found\n")
    res.end()
  }) 
}

module.exports = serverHandle

// env: process.env.NODE_ENV