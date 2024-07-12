import z from 'zod';

const UserSchema = {
  username: z.string({ message: 'Username is required.' })
    .min(3, {message: 'Username must be atleast 3 characters or more.'})
    .max(16, {message: 'Username cannot exceed 17 characters.'}),
  password: z.string({ message: 'Password is required.' })
    .min(8, {message: 'Password must contain atleast 8 characters or more.'}),
  email: z.string({ message: 'Email is required.' }).email({ message: 'Invalid email format.' })
};

export {
  UserSchema
}