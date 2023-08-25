const Project = require('../models/projectModel')
const ApiModel = require('../models/apiModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/AppError')

exports.getAllProjects = catchAsync(async (req, res, next) => {
  const projects = await Project.find()

  res.status(200).json({
    status: 'success',
    results: projects.length,
    projects
  })
})

exports.createProject = catchAsync(async (req, res, next) => {
  req.body.creator = req.user._id

  const project = await Project.create(req.body)

  // 创建默认api
  const api = await ApiModel.create({
    group: '默认',
    name: '默认api',
    path: '/getmail',
    creator: req.user._id,
    project: project._id
  })

  res.status(201).json({
    status: 'success',
    project
  })
})

exports.deleteProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByIdAndDelete(req.params.id)

  if (!project) {
    return next(new AppError('No project found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    message: `${project.name} delete successfully!`
  })
})

exports.updateProject = catchAsync(async (req, res, next) => {
  // 检查body中的excludedMembers是否包含管理员账号
  const { excludedMembers } = req.body
  excludedMembers && excludedMembers.forEach(async (memberId) => {
    const user = await User.findById(memberId)
    console.log(user)
    if (!user) return next(new AppError('No user found with that ID', 404))
    else if (user.role === 'admin') return next(new AppError("Can't exclude admin!", 400))

  })

  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!project) {
    return next(new AppError('No project found with that ID', 404))
  }

  res.status(200).json({
    status: 'success',
    project
  })
})