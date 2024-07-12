import { NextFunction, Request, Response } from 'express';
import z from 'zod';

const userRegistration = (request: Request, _response: Response, next: NextFunction) => {
  
  // Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

  const userCredentials = z.object({
    username: z.string({message: 'Username is required.'}).min(2).max(16),
    email: z.string({message: 'Email is required.'}).email({message: 'Invalid email format.'}),
    password: z.string({message: 'Password is required.'}).min(6).max(32).regex(passwordRegex)
  })

  try {

    // Validate input from zod schema
    const validatedData = userCredentials.parse(request.body)

    // Reattach validated data into body
    request.body = validatedData
    
    next()
  } catch (error: unknown) {
    next(error)
  }
}

const userAuthentication = (request: Request, _response: Response, next: NextFunction) => {

  const userCredentials = z.object({
    username: z.string({message: 'Username is required.'}).min(2).max(16),
    password: z.string({message: 'Password is required.'}).min(6).max(32)
  })
  
  try {

    // Validate input from zod schema
    const validatedData = userCredentials.parse(request.body)

    // Reattach validated data into body
    request.body = validatedData
  } catch (error: unknown) {
    next(error)
  }
}

export default {
  userRegistration,
  userAuthentication
}