import z from 'zod';

// If year is 2024, we minus it with 15, therefore adding age limits.
// const currentYear = new Date().getFullYear() - 15;
// const maxDate = new Date(currentYear, 11, 31);

const UserSchema = {
  username: z.string({ message: 'Username is required.' })
    .min(3, {message: 'Username must be atleast 3 characters or more.'})
    .max(16, {message: 'Username cannot exceed 17 characters.'})
    .refine((username) => !username.includes(' '), {
      message: 'Username cannot contain spaces.',
    }),
  password: z.string({ message: 'Password is required.' })
    .min(8, {message: 'Password must contain atleast 8 characters or more.'}),
  email: z.string({ message: 'Email is required.' }).email({ message: 'Invalid email format.' }),
  birthdate: z.string().datetime(),
  role: z.enum(['USER', 'TRAINER'])
};

export {
  UserSchema
}