import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

const handlePrismaError = (error: unknown) => {
  if (error instanceof PrismaClientKnownRequestError && error.meta?.target) {
    switch(error.code) {
      case 'P2002':
        return `${error.meta.target} is already taken.`
      default:
        return 'Unknown prisma error code'
    }
  } else {
    return new Error('Unknown error occurred.');
  }
}

const errorHandler = (error: unknown, _request: Request, response: Response, next: NextFunction) => {
  if (error instanceof ZodError) {

    const formattedErrors = error.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));

    return response.status(400).json({ errors: formattedErrors });

  } else if (error instanceof PrismaClientUnknownRequestError) {
    return response.status(400).json(error)
  } else if (error instanceof PrismaClientKnownRequestError) {
    const errorMessage = handlePrismaError(error)
    return response.status(400).json({error: `${errorMessage}`})
  } else if (error instanceof Error) {
    return response.status(400).json({error: error})
  }

  return next()
}

export default errorHandler