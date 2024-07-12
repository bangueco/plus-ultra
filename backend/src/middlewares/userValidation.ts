import { NextFunction, Request, Response } from 'express';
import z from 'zod';
import { UserSchema } from '../utils/schema';

const userRegistration = (request: Request, _response: Response, next: NextFunction) => {
  
  // Minimum of 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  );

  const userCredentials = z.object({
    username: UserSchema.username,
    email: UserSchema.email,
    password: UserSchema.password.regex(passwordRegex, {message: 'Password must contain atleast 8 characters, one uppercase letter, a number and a special character.'})
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
    username: UserSchema.username,
    password: UserSchema.password
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

export default {
  userRegistration,
  userAuthentication
}