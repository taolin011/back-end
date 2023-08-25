const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name!'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    sparse: true,
    unique: true,
  },
  phone: {
    type: String,
    sparse: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'A user must have a password!'],
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
})

// userSchema.virtual('projects', {
//   ref: 'Project',



// 密码加密
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// 检查密码是否正确
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model('User', userSchema)

