"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageEquipment = exports.identifyEquipment = void 0;
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
// Identify equipments based on the fetched results from Google Lens
const identifyEquipment = (response) => {
    const equipments = [
        'dumbbell', 'lat pulldown machine', 'barbell', 'pec deck machine', 'multi-flight machine', 'cable machine', 'smith machine'
    ];
    let equipmentCount = [];
    equipments.forEach(equipment => {
        // Regular Expression that exactly matches the equipment
        const regex = new RegExp(`\\b${equipment}\\b`, 'i');
        equipmentCount.push({ equipment_name: equipment, count: 0 });
        response.visual_matches.forEach(result => {
            if (regex.test(result.title)) {
                const index = equipmentCount.findIndex(item => item.equipment_name === equipment);
                equipmentCount[index].count += 1;
            }
        });
    });
    // Check if all counts have value
    const checkEmptyCount = equipmentCount.every((equipment) => equipment.count === 0);
    if (checkEmptyCount) {
        return {
            equipment_name: 'none',
            count: 0
        };
    }
    else {
        return equipmentCount.reduce((max, current) => (max.count > current.count) ? max : current, equipmentCount[0]);
    }
};
exports.identifyEquipment = identifyEquipment;
// Upload and process the image to third party storage
// The image that will be upload here will be use for SerpApi Google Lens
const uploadImageEquipment = (image) => __awaiter(void 0, void 0, void 0, function* () {
    const uploadResult = yield new Promise((resolve, reject) => {
        cloudinary_1.default.uploader.upload_stream((error, uploadResult) => {
            if (error) {
                reject(error);
            }
            else if (uploadResult) {
                return resolve(uploadResult);
            }
        }).end(image.buffer);
    });
    return uploadResult;
});
exports.uploadImageEquipment = uploadImageEquipment;
//# sourceMappingURL=equipment.service.js.map