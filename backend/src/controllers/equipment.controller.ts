import { NextFunction, Request, Response } from "express";
import { identifyEquipment, uploadImageEquipment } from "../services/equipment.service";
import axios from "axios";
import config from "../utils/config";
import { HttpStatusCode } from "../utils/http";
import { ApiError } from "../utils/error";

const identify = async (request: Request, response: Response, next: NextFunction) => {
  try {
    if (!request.file) {
      throw new ApiError(HttpStatusCode.NOT_FOUND, 'Image file not found.')
    }

    const imageData = request.file

    // Upload image to cloudinary
    const imageInfo = await uploadImageEquipment(imageData)

    // Make axios api request to use google lens
    const googleLens = await axios.get(`https://serpapi.com/search?engine=google_lens&url=${imageInfo.url}&api_key=${config.serpApiKey}`)

    // Identify equipment based on the fetched results
    const identify = identifyEquipment(googleLens.data)

    return response.status(HttpStatusCode.OK).json({equipment: identify.equipment_name})
    
  } catch (error) {
    return next(error)
  }
}

export default {
  identify
}