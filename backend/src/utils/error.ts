class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
    this.name = 'ApiError'
    this.message = message
    Error.captureStackTrace(this, this.constructor)
  }
}

export {
  ApiError
}