class BaseError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

class ApiError extends BaseError {
  constructor(status: number, message: string) {
    super(status, message)
    this.name = 'ApiError'
    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends BaseError {
  field: string

  constructor(status: number, field: string, message: string) {
    super(status, message)
    this.field = field
    this.name = 'ValidationError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export {
  ApiError,
  ValidationError
}