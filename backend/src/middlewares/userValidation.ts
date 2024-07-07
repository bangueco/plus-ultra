import { NextFunction, Request, Response } from 'express';
import { UserInputSchema } from '../utils/validationSchemas';

const validateUserRegistration = (request: Request, _response: Response, next: NextFunction) => {
  try {
    const { username, email, password } = request.body

    // Validate input from zod schema
    const validatedData = UserInputSchema.parse({username, email, password})

    // Reattach validated data into body
    request.body = validatedData
    
    next()
  } catch (error: unknown) {
    next(error)
  }
}

export {
  validateUserRegistration
}