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
const equipment_service_1 = require("../services/equipment.service");
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../utils/config"));
const http_1 = require("../utils/http");
const error_1 = require("../utils/error");
const identify = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!request.file) {
            throw new error_1.ApiError(http_1.HttpStatusCode.NOT_FOUND, 'Image file not found.');
        }
        const imageData = request.file;
        // Upload image to cloudinary
        const imageInfo = yield (0, equipment_service_1.uploadImageEquipment)(imageData);
        // Make axios api request to use google lens
        const googleLens = yield axios_1.default.get(`https://serpapi.com/search?engine=google_lens&url=${imageInfo.url}&api_key=${config_1.default.serpApiKey}`);
        // Identify equipment based on the fetched results
        const identify = (0, equipment_service_1.identifyEquipment)(googleLens.data);
        return response.status(http_1.HttpStatusCode.OK).json({ equipment: identify.equipment_name });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = {
    identify
};
//# sourceMappingURL=equipment.controller.js.map