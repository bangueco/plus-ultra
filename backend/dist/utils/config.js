"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    port: process.env.PORT || 3000,
    url: process.env.URL,
    jwtAccessKey: process.env.JWT_ACCESS_TOKEN_SECRET_KEY || '',
    jwtRefreshKey: process.env.JWT_REFRESH_TOKEN_SECRET_KEY || '',
    serpApiKey: process.env.SERP_API_KEY || '',
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    gmailUsername: process.env.GMAIL_USERNAME,
    gmailPassword: process.env.GMAIL_PASSWORD
};
exports.default = config;
//# sourceMappingURL=config.js.map