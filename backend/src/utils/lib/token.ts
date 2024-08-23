import jwt from 'jsonwebtoken'
import config from '../config'

const generateAccessToken = (id: number, username: string) => {
  return jwt.sign({id, username}, config.secretKey, {expiresIn: '10m'})
}

const generateRefreshToken = (id: number, username: string) => {
  return jwt.sign({id, username}, config.secretKey, {expiresIn: '30d'})
}

const verifyToken = (token: string) => {
  return jwt.verify(token, config.secretKey)
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
}