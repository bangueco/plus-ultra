import config from '../utils/config';
import jwt from 'jsonwebtoken';

const verifyToken = (token: string) => {
  return jwt.verify(token, config.secretKey)
}

export default {
  verifyToken
}