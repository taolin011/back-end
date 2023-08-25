class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true // 操作性错误，非bug错误，如用户输入错误等

    // 捕获堆栈信息
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError