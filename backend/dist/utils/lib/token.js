"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateEmailToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const generateAccessToken = (id, username) => {
    return jsonwebtoken_1.default.sign({ id, username }, config_1.default.jwtAccessKey, { expiresIn: '10m' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (id, username) => {
    return jsonwebtoken_1.default.sign({ id, username }, config_1.default.jwtRefreshKey, { expiresIn: '30d' });
};
exports.generateRefreshToken = generateRefreshToken;
const generateEmailToken = (email) => {
    return jsonwebtoken_1.default.sign({ email }, config_1.default.jwtAccessKey);
};
exports.generateEmailToken = generateEmailToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessKey);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=token.js.map