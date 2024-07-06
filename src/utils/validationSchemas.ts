import z from 'zod'

// Validation for user input schema

const UserInputSchema = z.object({
  username: z.string({message: 'Username is required.'}).min(4, {message: 'Username must contain at least 4 characters or more.'}),
  email: z.string({message: 'Email is required.'}).email(),
  password: z.string({message: 'Password is required.'}).min(8, {message: 'Password must contain at least 8 characters or more.'})
})

export {
  UserInputSchema
}