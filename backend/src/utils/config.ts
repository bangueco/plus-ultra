import dotenv from 'dotenv'
dotenv.config()

const config = {
  port: process.env.PORT || 3000,
  jwtAccessKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY || '',
  jwtRefreshKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY || '',
  serpApiKey: process.env.SERP_API_KEY || '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
}

export default config