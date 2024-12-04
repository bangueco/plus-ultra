"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const schema_1 = require("../utils/schema");
const error_1 = require("../utils/error");
const http_1 = require("../utils/http");
const userRegistration = (request, _response, next) => {
    // Minimum of 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
    const userCredentials = zod_1.default.object({
        username: schema_1.UserSchema.username,
        email: schema_1.UserSchema.email,
        birthdate: schema_1.UserSchema.birthdate,
        password: schema_1.UserSchema.password.regex(passwordRegex, { message: 'Password must contain atleast 8 characters, one uppercase letter, a number and a special character.' }),
        role: schema_1.UserSchema.role
    });
    try {
        // Validate input from zod schema
        const validatedData = userCredentials.parse(request.body);
        // Reattach validated data into body
        request.body = validatedData;
        next();
    }
    catch (error) {
        next(error);
    }
};
const userAuthentication = (request, _response, next) => {
    const userCredentials = zod_1.default.object({
        username: schema_1.UserSchema.username,
        password: schema_1.UserSchema.password
    });
    try {
        // Validate input from zod schema
        const validatedData = userCredentials.parse(request.body);
        // Reattach validated data into body
        request.body = validatedData;
        next();
    }
    catch (error) {
        next(error);
    }
};
const userToken = (request, _response, next) => {
    try {
        const authorizationHeader = request.get('authorization');
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, 'Invalid authorization header.');
        }
        const token = authorizationHeader.replace('Bearer ', '');
        if (!token) {
            throw new error_1.ApiError(http_1.HttpStatusCode.NOT_FOUND, 'Token not found.');
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = {
    userRegistration,
    userAuthentication,
    userToken
};
//# sourceMappingURL=validate.js.map