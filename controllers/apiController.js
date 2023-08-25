const ApiModel = require('../models/apiModel')

const Project = require('../models/projectModel')

const catchAsync = require('../utils/catchAsync')

const AppError = require('../utils/AppError')



exports.createApi = catchAsync(async (req, res, next) => {

  req.body.creator = req.user._id

  req.body.updater = req.user._id

  req.body.project = req.params.id



  // 权限检测

  const project = await Project.findById(req.body.project)

  project.excludedMembers.forEach(id => { 

    if(String(id) === String(req.body.creator)) return next(new AppError("You don't have permission to perform this action", 403))

  })



  const api = await ApiModel.create(req.body)



  res.status(201).json({

    status: 'success',

    api

  })

})



exports.getApis = catchAsync(async (req, res, next) => {

  const apis = await ApiModel.find({ project: req.params.id })



  res.status(200).json({

    status: 'success',

    results: apis.length,

    apis

  });

})



exports.getApiDetail = catchAsync(async (req, res, next) => {

  const api = await ApiModel.findById(req.params.id)



  if (!api) {

    return next(new AppError('API not found', 404));

  }

  res.status(200).json({

    status: 'success',

    results: api.length,

    api

  })

})



exports.deleteApi = catchAsync(async (req, res, next) => {

  const deletedApi = await ApiModel.findByIdAndDelete(req.params.id);



  if (!deletedApi) {

    return next(new AppError('API not found', 404));

  }



  res.status(200).json({

    status: 'success',

    message: `${deletedApi.name} delete successfully!` 

  });

})



exports.updateApi = catchAsync(async (req, res, next) => {

  req.body.updater = req.user._id

  const updatedApi = await ApiModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if (!updatedApi) return next(new AppError('API not found', 404))

  res.status(200).json({
    status: 'success',
    api: updatedApi
  })

})