const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

const signToken = (id, req, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    // 有效期
    expiresIn: process.env.JWT_EXPIRES_IN
  })

  res.cookie('jwt', token, {
    maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  })

  return token
}

exports.protect = catchAsync(async (req, res, next) => {

  // 1. 获取token
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies) {
    token = req.cookies.jwt
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401))
  }

  // 2. 验证token
  const decoded = await jwt.verify(token, process.env.JWT_SECRET)

  // 3. 检查用户是否存在
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401))
  }

  // 4. 访问控制
  req.user = currentUser
  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'user']
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }

    next()
  }
}

exports.signup = catchAsync(async (req, res, next) => {
  if (req.body.role === 'admin') return next(new AppError('You are not allowed to create an admin account', 403))
  const newUser = await User.create(req.body)

  const token = signToken(newUser._id, req, res)

  // 清除密码
  newUser.password = undefined
 
  res.status(201).json({
    status: 'success',
    user: newUser
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { name, password } = req.body

  // 1. 检查邮箱和密码是否存在
  if (!name || !password) {
    return next(new AppError('Please provide name and password', 400))
  }

  const user = await User.findOne({ name }).select('+password')
  if (!user) return next(new AppError('Incorrect name or password', 401)) 
  
  const correct = await user.correctPassword(password, user.password)
  if (!correct) return next(new AppError('Incorrect name or password', 401))
  
  const token = signToken(user._id, req, res)
  // 清除密码
  user.password = undefined

  res.status(200).json({
    status: 'success',
    token,
    user
  })
})

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', null)
  res.status(200).json({
    status: 'success'
  })
})

