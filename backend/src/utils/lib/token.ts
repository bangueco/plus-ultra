import jwt from 'jsonwebtoken'
import config from '../config'

const generateAccessToken = (id: number, username: string) => {
  return jwt.sign({id, username}, config.jwtAccessKey, {expiresIn: '10m'})
}

const generateRefreshToken = (id: number, username: string) => {
  return jwt.sign({id, username}, config.jwtRefreshKey, {expiresIn: '30d'})
}

const generateEmailToken = (email: string) => {
  return jwt.sign({email}, config.jwtAccessKey)
}

const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwtAccessKey)
}

export {
  generateAccessToken,
  generateRefreshToken,
  generateEmailToken,
  verifyToken
}