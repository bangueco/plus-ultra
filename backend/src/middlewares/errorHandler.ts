import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ZodError, ZodIssue, ZodIssueCode } from "zod";

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
    return 'Unknown instance error.'
  }
}

const handleZodError = (error: ZodError) => {
  const errorsMap = error.issues.map((issue: ZodIssue) => {
    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        return {error: {path: issue.path[0], message: issue.message}}
      case ZodIssueCode.invalid_string:
        return {error: {path: issue.path[0], message: issue.message}}
      case ZodIssueCode.too_small:
        return {error: {path: issue.path[0], message: issue.message}}
      default:
        return {error: `unspecified zod issue error: ${issue.code}.`}
    }
  })

  return errorsMap
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
    return response.status(400).json({error: error.message})
  }

  return next()
}

export default errorHandler