import { Request, Response, NextFunction } from "express";
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

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
    return response.status(400).json(error)
  }

  return next()
}

export default errorHandler