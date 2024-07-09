import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

const handlePrismaError = (error: unknown) => {
  if (error instanceof PrismaClientKnownRequestError && error.meta?.target) {
    switch(error.code) {
      case 'P2002':
        return {
          error: {
            path: `${error.meta.target}`, 
            message: `${error.meta.target} is already taken.`
          }
        }
      default:
        return {error: {message: 'Unknown prisma error code.'}}
    }
  } else if (error instanceof PrismaClientUnknownRequestError) {
    return error.message
  } else {
    return
  }
}

const handleZodError = (error: unknown) => {
  if (error instanceof ZodError && error.issues[0].code === 'invalid_type') {
    const errorsMap = error.issues.map(error => ({
      path: error.path,
      message: error.message
    }))
    return {error: errorsMap}
  } else {
    return
  }
}

const errorHandler = (error: unknown, _request: Request, response: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    const errorMessage = handleZodError(error)
    return response.status(400).json(errorMessage)
  } else if (error instanceof PrismaClientUnknownRequestError) {
    const errorMessage = handlePrismaError(error)
    return response.status(500).json({error: `${errorMessage}`})
  } else if (error instanceof PrismaClientKnownRequestError) {
    const errorMessage = handlePrismaError(error)
    return response.status(400).json(errorMessage)
  } else if (error instanceof Error) {
    return response.status(400).json({error: error})
  }

  return next()
}

export default errorHandler