const mongoose = require('mongoose')



const bodySchema = new mongoose.Schema({

  attr: String,

  attrValue: String,

  typeValue: {

    type: String,

    enum: ['string', 'number', 'boolean', 'array', 'object']

  },

  summary: String,

  children: [this]

})



const responseBody = new mongoose.Schema({

  attr: String,

  attrValue: String,

  typeValue: {

    type: String,

    enum: ['string', 'number', 'boolean', 'array', 'object']

  },

  summary: String,

  mock: {

    type: String,

    enum: ['@cname', '@int', '@float', '@phone', '@sentence', '@paragraph', '@date', '@email', '@image'],

  },

  children: [this]

})



const responseSchema = new mongoose.Schema({

  statusCode: {

    type: Number,

    required: [true, 'A response must have a statusCode!'],

  },

  summary: String,

  body: [responseBody]

});





const apiSchema = mongoose.Schema({

  group: {

    type: String,

    require: [true, 'A api must have a group!'],

  },

  arrow: {

    type: Boolean,

    default: true

  },

  name: {

    type: String,

    required: [true, 'A api must have a name!'],

    trim: true,

  },

  state: {

    type: String,

    enum: ['开发中', '已完成'],

    default: '开发中'

  },

  description: String,

  summary: String,

  method: {

    type: String,

    enum: ['get', 'post', 'put', 'patch', 'delete'],

    default: 'get'

  },

  path: String,

  createdTimeStamp: {

    type: Number,

    default: Date.now()

  },

  // 创建人

  creator: {

    type: mongoose.Schema.ObjectId,

    ref: 'User',

    required: [true, 'A api must have a creator!'],

  },

  // 修改人

  updater: {

    type: mongoose.Schema.ObjectId,

    ref: 'User',

  },

  // 责任人

  director: {

    type: mongoose.Schema.ObjectId,

    ref: 'User',

  },

  project: {

    type: mongoose.Schema.ObjectId,

    ref: 'Project',

    required: [true, 'A api must have a project!'],

  },

  params: [bodySchema],

  query: [bodySchema],

  body: [bodySchema],

  response: [responseSchema],

}, {

  toJSON: { virtuals: true },

  toObject: { virtuals: true }

})





apiSchema.pre(/^find/, function(next) {

  this.populate({

    path: 'creator',

    select: 'name'

  }).populate({

    path: 'updater',

    select: 'name'

  }).populate({

    path: 'director',

    select: 'name'

  })



  next()

})



module.exports = mongoose.model('Api', apiSchema)