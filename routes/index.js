const express = require('express')
const router = express.Router()
const { signup,login,protect,logout,restrictTo } = require('../controllers/userController')
const { getAllProjects, createProject, deleteProject, updateProject } = require('../controllers/projectController')
const { createApi, getApis, getApiDetail, deleteApi, updateApi } = require('../controllers/apiController')

// 认证
router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)

// 项目
router.route('/project')
  .get(getAllProjects)
  .post(protect, restrictTo('admin'), createProject)
router.route('/project/:id')
  .patch(protect, restrictTo('admin'), updateProject)
  .delete(protect, restrictTo('admin'), deleteProject)
  // 接口
  .get(getApis)
  .post(protect, createApi)

router.route('/interface/:id')
  .get(getApiDetail)
  .delete(protect, deleteApi)
  .patch(protect, updateApi)

module.exports = router


/**
  * @swagger
  * /api/signup:
  *   post:
  *     tags:
  *     - User 用户
  *     description: 用户注册
  *     summary: 用户注册
  *     consumes:
  *     - application/json
  *     parameters:
  *     - in: body
  *       name: user
  *       description: 用户注册
  *       schema:
  *         type: object
  *         required:
  *         - name
  *         - password
  *         properties:
  *           name:
  *             type: string
  *           password:
  *             type: string
  *     responses:
  *       201:
  *         description: 注册成功
  *         schema:
  *           type: object
  *           properties:
  *             status:
  *               type: string
  *               example: success
  *             user:
  *               type: object
  *               properties:
  *                 _id:
  *                   type: string
  *                 name:
  *                   type: string
  *                 role:
  *                   type: string
  * 
  * 
*/

/**
 * @swagger
 * /api/login:
 *  post:
 *   tags:
 *   - User 用户
 *   summary: 用户登录
 *   consumes:
 *   - application/json
 *   parameters:
 *   - in: body
 *     name: user
 *     description: 需传入 用户名name 和 密码password
 *     schema:
 *       type: object
 *       required:
 *       - name
 *       - password
 *       properties:
 *        name:
 *         type: string
 *         example: 管理员
 *        password:
 *         type: string
 *         example: 123456
 *   responses:
 *    200:
 *     description: 登录成功
 *     schema:
 *      type: object
 *      properties:
 *       status:
 *        type: string
 *        example: success
 *       token: 
 *        type: string
 *        example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *       user:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *         name:
 *    401:
 *     description: 登录失败，可能未传入必需字段或用户名和密码错误
 *     schema:
 *      type: object
 *      properties:
 *       status: 
 *        type: string
 *        example: fail
 *       message:
 *        type: string
 *        example: Incorrect name or password
 * 
*/


/**
 * @swagger
 * /api/project:
 *  get:
 *   tags:
 *   - Project 项目
 *   summary: 获取所有项目
 *   consumes:
 *   - application/json
 *   responses:
 *    200:
 *     description: 获取成功
 *     schema:
 *      type: object
 *      properties:
 *       status:
 *        type: string
 *        example: success
 *       results:
 *        type: integer
 *        example: 1
 *       projects:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           example: 64db329bbf6e354b5da1e1fa
 *          name:
 *           type: string
 *           example: 项目1
 *          creator:
 *           type: string
 *           example: 64db0ba28066ab44398fe284
 *          createdTimeStamp:
 *           type: integer
 *           example: 1692086885991
 * 
 *  post:
 *   tags:
 *   - Project 项目
 *   summary: 创建项目
 *   consumes:
 *   - application/json
 *   parameters:
 *   - in: body
 *     name: project
 *     description: 需传入 项目名name 描述summary
 *     schema:
 *      type: object
 *      required:
 *      - name
 *      - summary
 *      properties:
 *       name:
 *        type: string
 *        example: 项目1
 *       summary:
 *        type: string
 *        example: 项目1的描述
 *   responses:
 *    201:
 *     description: 创建成功
 *     schema:
 *      type: object
 *      properties:
 *       status:
 *        type: string
 *        example: success
 *       project:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          example: 64db329bbf6e354b5da1e1fa
 *         name:
 *          type: string
 *          example: 项目1
 *         creator:
 *          type: string
 *          example: 64db0ba28066ab44398fe284
 *         excludedMembers:
 *          type: array
 *         createdTimeStamp:
 *          type: integer
 *          example: 1692086885991
*/

/**
 * @swagger
 * /api/project/{id}:
 *  delete:
 *   tags:
 *   - Project 项目
 *   summary: 删除项目
 *   consumes:
 *   - application/json
 *   parameters:
 *   - in: path
 *     name: id
 *     description: 项目id
 *     schema:
 *      type: string
 *      example: 64db329bbf6e354b5da1e1fa
 *   responses:
 *    200:
 *     description: 删除成功
 *     schema:
 *      type: object
 *      properties:
 *       status:
 *        type: string
 *        example: success
 *       message:
 *        type: string
 *        example: delete project successfully!
 * 
 *  patch:
 *   tags:
 *   - Project 项目
 *   summary: 更新项目，如更新项目名和描述，或设置成员权限
 *   consumes:
 *   - application/json
 *   parameters:
 *   - in: path
 *     name: id
 *     description: 项目id
 *     schema:
 *      type: string
 *      example: 64db329bbf6e354b5da1e1fa
 *   - in: body
 *     name: project
 *     description: 可传入任何数据库中允许的字段，如name, summary, excludedMembers(无权限的成员，数组类型)
 *     schema:
 *      type: object
 *      properties:
 *       name:
 *        type: string
 *        example: 项目1
 *       summary:
 *        type: string
 *        example: 项目1的描述
 *       excludedMembers:
 *        type: array
 *        items:
 *         type: string
 *         example: 64db0ba28066ab44398fe284
 *   responses:
 *    200:
 *     description: 更新成功
 *     schema:
 *      type: object 
 *      properties:
 *       status:
 *        type: string
 *        example: success
 *       project:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          example: 64db329bbf6e354b5da1e1fa
 *         name:
 *          type: string
 *          example: 项目1
 *         summary:
 *          type: string
 *          example: 项目1的描述
 *         creator:
 *          type: string
 *          example: 64db0ba28066ab44398fe284
 *         createdTimeStamp:
 *          type: integer
 *          example: 1692086885991
 *         excludedMembers:
 *          type: array
 *          items:
 *           type: string
 *           example: 64db0ba28066ab44398fe284
 * 
 *      
 * 
 *  get:
 *   tags:
 *   - Interface 接口
 *   summary: 查询某个项目下的所有接口
 *   consumes:
 *   - application/json
 *   parameters:
 *   - in: path
 *     name: id
 *     description: 项目id
 *     schema:
 *      type: string
 *      example: 64db329bbf6e354b5da1e1fa
 *   responses:
 *    200:
 *     description: 查询成功
 *     schema:
 *      type: object
 *      properties:
 *       status:
 *        type: string
 *        example: success
 *       results:
 *        type: integer
 *        example: 1
 *       apis:
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          _id:
 *           type: string
 *           example: 64db329bbf6e354b5da1e1fa
 *          name:
 *           type: string
 *           example: 项目1
 *          group:
 *           type: string
 *           example: 分组1
 *          path:
 *           type: string
 *           example: /getAllProjects
 *          method:
 *           type: string
 *           example: get
 *          state:
 *           type: string
 *           example: 开发中
 *          creator:
 *           type: string
 *           example: 64db0ba28066ab44398fe284
 *          createdTimeStamp:
 *           type: integer
 *           example: 1692086885991
 *      
 *      
 *         
 *  post:
 *   tags:
 *   - Interface 接口
 *   summary: 创建某个项目下的一个接口
 *   consumes:
 *   - application/json
 *   parameters:
 *   - in: path
 *     name: id
 *     description: 项目id
 *     schema:
 *      type: string
 *      example: 64db329bbf6e354b5da1e1fa
 *   - in: body
 *     name: interface
 *     description: 可传入 name group arrow summary method path 责任人director params query body response
 *     schema:
 *      type: object
 *      properties:
 *       name:
 *        type: string
 *        example: 接口1
 *       group:
 *        type: string
 *        example: 分组1 
 *       method: 
 *        type: string
 *        example: post
 *       path: 
 *        type: string
 *        example: /getmail
 *       director:
 *        type: string
 *        example: 64db329bbf6e354b5da1e1fa
 *       params: 
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *           example: id
 *          value:
 *           type: string
 *           example: 10000000001
 *          type:
 *           type: string
 *           example: number
 *          summary:
 *           type: string
 *           example: params参数id
 *       query:
 *        type: array
 *        items:
 *         type: string
 *         example: 和params结构一样，参考上面
 *       body:
 *        type: array
 *        items:
 *         type: object
 *         properties: 
 *          attr:
 *           type: string
 *           example: color
 *          attrValue:
 *           type: string
 *           example: red
 *          type:
 *           type: string
 *           example: string
 *          summary:
 *           type: string
 *           example: body的color属性
 *          children:
 *           type: array
 *           items:
 *            type: string
 *            example: 数组里面放对象，同样有attr,attrvalue,type,summary,children
 *       response:
 *        type: array
 *        items: 
 *         type: object
 *         properties:
 *          statusCode:
 *           type: number
 *           example: 200
 *          summary:
 *           type: string
 *           example: 响应成功
 *          body:
 *           type: array
 *           items:
 *            type: string
 *            example: 数组里面放对象，跟上面的body结构一样
 *   responses:
 *    200:
 *     description: 创建成功
 *     schema:
 *      type: object
 *      properties:
 *       status:
 *        type: string
 *        example: success
 *       api:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          example: 64db329bbf6e354b5da1e1fa
 *         name:
 *          type: string
 *          example: 接口1
 *         group:
 *          type: string
 *          example: 分组1
 *         method:
 *          type: string
 *          example: get
 *         state:
 *          type: string
 *          example: 开发中
 *         creator:
 *          type: string
 *          example: 64db0ba28066ab44398fe284
 *         createdTimeStamp:
 *          type: integer
 *          example: 1692086885991
 *         other:
 *          type: string
 *          example: 其它字段参考请求的body参数
*/ 


/**
 * @swagger
 * /api/interface/{id}:
 *  get:
 *   tags:
 *   - Interface 接口
 *   summary: 获取某个接口详情
 *   consumes:
 *   - application/json
 *   responses:
 *    200:
 *     description: 获取成功
 *     schema:
 *      type: object
 *      properties:
 *       status:
 *        type: string
 *        example: success
 *       results:
 *        type: integer
 *        example: 1
 *       api:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          example: 64db329bbf6e354b5da1e1fa
 *         name:
 *          type: string
 *          example: 接口1
 *         creator:
 *          type: string
 *          example: 64db0ba28066ab44398fe284
 *         createdTimeStamp:
 *          type: integer
 *          example: 1692086885991
 *         group:
 *          type: string
 *          example: 分组一
 *         path:
 *          type: string
 *          example: /api/test
 *         method:
 *          type: string
 *          example: get
 *         state:
 *          type: string
 *          example: 开发中
 *         arrow:
 *          type: Boolean
 *          example: true
 *  delete:
 *   tags:
 *   - Interface 接口
 *   summary: 删除接口
 *   consumes:
 *   - application/json
 *   parameters:
 *   - in: path
 *     name: id
 *     description: 接口id
 *     schema:
 *      type: string
 *      example: 64db329bbf6e354b5da1e1fa
 *   responses:
 *    200:
 *     description: 删除成功
 *     schema:
 *      type: object
 *      properties:
 *       status:
 *        type: string
 *        example: success
 *       message:
 *        type: string
 *        example: delete api successfully!
 * 
 *  patch:
 *   tags:
 *   - Interface 接口
 *   summary: 更新接口
 *   consumes:
 *   - application/json
 *   parameters:
 *   - in: path
 *     name: id
 *     description: 接口id
 *     schema:
 *      type: string
 *      example: 64db329bbf6e354b5da1e1fa
 *   - in: body
 *     name: project
 *     description: 可传入任何数据库中允许的字段，如name group method path params query body response
 *     schema:
 *      type: object
 *      properties:
 *       name:
 *        type: string
 *        example: 接口1
 *       group:
 *        type: string
 *        example: 分组1 
 *       method: 
 *        type: string
 *        example: post
 *       path: 
 *        type: string
 *        example: /getmail
 *       params: 
 *        type: array
 *        items:
 *         type: object
 *         properties:
 *          name:
 *           type: string
 *           example: id
 *          value:
 *           type: string
 *           example: 10000000001
 *          type:
 *           type: string
 *           example: number
 *          summary:
 *           type: string
 *           example: params参数id
 *       query:
 *        type: array
 *        items:
 *         type: string
 *         example: 和params结构一样，参考上面
 *       body:
 *        type: array
 *        items:
 *         type: object
 *         properties: 
 *          attr:
 *           type: string
 *           example: color
 *          attrValue:
 *           type: string
 *           example: red
 *          type:
 *           type: string
 *           example: string
 *          summary:
 *           type: string
 *           example: body的color属性
 *          children:
 *           type: array
 *           items:
 *            type: string
 *            example: 数组里面放对象，同样有attr,attrvalue,type,summary,children
 *       response:
 *        type: array
 *        items: 
 *         type: object
 *         properties:
 *          statusCode:
 *           type: number
 *           example: 200
 *          summary:
 *           type: string
 *           example: 响应成功
 *          body:
 *           type: array
 *           items:
 *            type: string
 *            example: 数组里面放对象，跟上面的body结构一样
 *   responses:
 *    200:
 *     description: 更新成功
 *     schema:
 *      type: object 
 *      properties:
 *       status:
 *        type: string
 *        example: success
 *       project:
 *        type: object
 *        properties:
 *         _id:
 *          type: string
 *          example: 64db329bbf6e354b5da1e1fa
 *         name:
 *          type: string
 *          example: 项目1
 *         summary:
 *          type: string
 *          example: 项目1的描述
 *         state:
 *          type: string
 *          example: 开发中
 *         creator:
 *          type: string
 *          example: 64db0ba28066ab44398fe284
 *         updater:
 *          type: string
 *          example: 64db0ba28066ab44398fe284
 *         createdTimeStamp:
 *          type: integer
 *          example: 1692086885991
 *         excludedMembers:
 *          type: array
 *          items:
 *           type: string
 *           example: 64db0ba28066ab44398fe284
 *         other:
 *          type: string
 *          example: 其它字段参考请求的body参数
*/

