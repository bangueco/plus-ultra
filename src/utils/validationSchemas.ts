import z from 'zod'

// Validation for user input schema

const UserInputSchema = z.object({
  username: z.string().min(4),
  email: z.string().email(),
  password: z.string().min(8)
})

export {
  UserInputSchema
}