import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary"
import cloudinary from "../utils/cloudinary"

type LensApiResult = {
  visual_matches: Array<{title: string, position: number}>
}

type EquipmentCountProps = {
  equipment_name: string,
  count: number
}

type Image = {
  fieldname: string,
  originalname: string,
  encoding: string,
  mimetype: string,
  buffer: Buffer
  size: number
}

// Identify equipments based on the fetched results from Google Lens
const identifyEquipment = (response: LensApiResult) => {

  const equipments = [
    'dumbbell',
    'lat pulldown',
    'barbell'
  ]

  let equipmentCount: Array<EquipmentCountProps> = []
  
  equipments.forEach(equipment => {
    
    equipmentCount.push({equipment_name: equipment, count: 0})

    response.visual_matches.forEach(result => {
      if (result.title.toLowerCase().includes(equipment)) {
        const index = equipmentCount.findIndex(item => item.equipment_name === equipment)
        equipmentCount[index].count += 1
      }
    })
  })

  return equipmentCount.reduce((max, current) => (max.count > current.count) ? max : current, equipmentCount[0])
}

// Upload and process the image to third party storage
// The image that will be upload here will be use for SerpApi Google Lens
const uploadImageEquipment = async (image: Image) => {
  const uploadResult = await new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream((error, uploadResult) => {
        if (error) {
          reject(error)
        } else if (uploadResult) {
          return resolve(uploadResult);
        }
    }).end(image.buffer);
  });

  return uploadResult
};

export {
  identifyEquipment,
  uploadImageEquipment
}