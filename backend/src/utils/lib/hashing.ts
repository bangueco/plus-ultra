import bcrypt from 'bcrypt'

const hashPassword = async (password: string) => {
  // this returns hashed password
  return await bcrypt.hash(password, 10)
}

const verifyPassword = async (password: string, hashedPassword: string) => {
  // this returns boolean
  return await bcrypt.compare(password, hashedPassword)
}

export {
  hashPassword,
  verifyPassword
}