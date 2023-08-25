const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A project must have a name!'],
    unique: true,
    trim: true,
  },
  // 描述
  description: String,
  // 摘要
  summary: String,
  // 创建时间戳
  createdTimeStamp: {
    type: Number,
    default: Date.now()
  },
  // 创建者
  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A project must have a creator!'],
  },
  // 成员
  excludedMembers: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})


module.exports = mongoose.model('Project', projectSchema)


