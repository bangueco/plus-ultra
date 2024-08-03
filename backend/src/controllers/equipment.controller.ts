import { NextFunction, Request, Response } from "express";

const identify = (request: Request, response: Response, next: NextFunction) => {
  try {
    if (!request.file) {
      return response.status(404).json({error: 'No file upload'})
    }

    const imageData = request.file.buffer

    if (imageData) {
      return response.status(200).json({message: 'image found'})
    }
    
  } catch (error) {
    return next(error)
  }
}

export default {
  identify
}