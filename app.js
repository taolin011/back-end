const express = require('express')

const router = require('./routes')

const dotenv = require('dotenv')

const cookieParser = require('cookie-parser')

const mongoose = require('mongoose')

const AppError = require('./utils/AppError')

const swaggerJSDoc = require('swagger-jsdoc')

const swaggerUi = require('swagger-ui-express')

const ApiModel = require('./models/apiModel')

const toObject = require('./utils/toObject')



const app = express()

app.get('/', (req,res) => {
  res.send('服务器启动成功！')
})


const swaggerDefinition = {

  info: {

    title: 'Node Swagger API',

    version: '1.0.0',

    description: 'Swagger API for Node.js',

  },

  host: 'localhost:8080',

  basePath: '/',

}



const options = {

  swaggerDefinition,

  apis: ['./routes/*.js'] // 写有注解的router的存放地址

  // apis: ['app.js']

}



const swaggerSpec = swaggerJSDoc(options)



app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))





app.get('/api-docs.json', function(req, res) {

  res.setHeader('Content-Type', 'application/json')

  res.send(swaggerSpec)

})





dotenv.config({ path: './config.env' })



// 解析json数据 

app.use(express.json({ limit: '10kb' }))

app.use(cookieParser())



// 连接数据库

const DB = process.env.DB

mongoose.connect(DB)

  .then(con => {

  // console.log(con.connections)

  console.log('DB connection successful!')

}).catch(err => {

  console.log('DB connection failed!', err)

})



app.use('/api/mock', async (req, res, next) => {

  const path = req.path

  const method = req.method.toLowerCase()

  

  const api = await ApiModel.findOne({ path, method })

  

  if (api) {

    if (api.response.length !== 0) {

      const statusCode = api.response[0].statusCode

      const body = toObject(api.response[0].body)

      res.status(statusCode).json(body)

    } else {

      next(new AppError(`This api with method ${method} and path ${path} has no response!`, 404))

    }

  } else {

    next(new AppError(`This api with method ${method} and path ${path} is not defined!`, 404))

  }

});


// 路由

app.use('/api', router)



// 错误url处理

app.all('*', (req, res, next) => {

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404))

})

// 全局错误处理

app.use((err, req, res, next) => {

  err.statusCode = err.statusCode || 500

  err.status = err.status || 'error'

  res.status(err.statusCode).json({

    status: err.status,

    message: err.message,

    error: err

  })

})





app.listen('8080', () => {

  console.log('app running at port 8080')

})