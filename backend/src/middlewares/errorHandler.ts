import { Request, Response } from "express";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ZodError, ZodIssue, ZodIssueCode } from "zod";
import { ApiError, ValidationError } from "../utils/error";
import { HttpStatusCode } from "../utils/http";

const handlePrismaError = (error: unknown) => {
  if (error instanceof PrismaClientKnownRequestError && error.meta?.target) {
    switch(error.code) {
      case 'P2002':
        return {
          status: HttpStatusCode.BAD_REQUEST,
          field: error.meta.target,
          message: `${error.meta.target} is already taken.`
        }
      default:
        return {status: HttpStatusCode.INTERNAL_SERVER_ERROR, message: 'Unknown prisma error code.'}
    }
  } else if (error instanceof PrismaClientUnknownRequestError) {
    return {status: HttpStatusCode.INTERNAL_SERVER_ERROR, message: error.message}
  } else {
    return {status: HttpStatusCode.INTERNAL_SERVER_ERROR, message: "Unknown prisma instance error."}
  }
}

const handleZodError = (error: ZodError) => {
  const errorsMap = error.issues.map((issue: ZodIssue) => {
    switch (issue.code) {
      case ZodIssueCode.invalid_type:
      case ZodIssueCode.invalid_string:
      case ZodIssueCode.too_small:
        return {field: issue.path[0], message: issue.message}
      default:
        return {message: `unspecified zod issue error: ${issue.code}.`}
    }
  })

  return errorsMap
}

const errorHandler = (error: unknown, _request: Request, response: Response) => {
  if (error instanceof ZodError) {
    const zod = handleZodError(error)
    return response.status(400).json(zod)
  } else if (error instanceof PrismaClientUnknownRequestError || error instanceof PrismaClientKnownRequestError) {
    const {status, message} = handlePrismaError(error)
    return response.status(status).json({message: message})
  } else if (error instanceof ApiError) {
    return response.status(error.status).json({message: error.message})
  } else if (error instanceof ValidationError) {
    return response.status(error.status).json({field: error.field, message: error.message})
  } else {
    return response.status(500).json({message: 'An unexpected error occured.'})
  }
}

export default errorHandler