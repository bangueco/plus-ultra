import dotenv from 'dotenv'
dotenv.config()

const config = {
  databaseUser: process.env.DATABASE_USER || '',
  databasePassword: process.env.DATABASE_PASSWORD || '',
  databaseName: process.env.DATABASE_NAME || '',
  host: process.env.HOST || '',
  port: process.env.PORT || 3000,
  secretKey: process.env.SECRET_KEY || '',
  serpApiKey: process.env.SERP_API_KEY || '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
}

export default config