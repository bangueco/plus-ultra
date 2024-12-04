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
const user_service_1 = __importDefault(require("../services/user.service"));
const http_1 = require("../utils/http");
const error_1 = require("../utils/error");
const hashing_1 = require("../utils/lib/hashing");
const token_1 = require("../utils/lib/token");
const email_service_1 = __importDefault(require("../services/email.service"));
const register = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password, birthdate, role } = request.body;
        const isUsernameExist = yield user_service_1.default.findByUsername(username);
        const isEmailExist = yield user_service_1.default.findByEmail(email);
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (isUsernameExist)
            throw new error_1.ValidationError(http_1.HttpStatusCode.BAD_REQUEST, 'username', 'Username is already taken.');
        if (isEmailExist)
            throw new error_1.ValidationError(http_1.HttpStatusCode.BAD_REQUEST, 'email', 'Email is already taken.');
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 15) {
            throw new error_1.ValidationError(http_1.HttpStatusCode.BAD_REQUEST, 'birthdate', 'You must be over 15 years old.');
        }
        const hashedPassword = yield (0, hashing_1.hashPassword)(password);
        const emailToken = (0, token_1.generateEmailToken)(email);
        email_service_1.default.sendVerificationEmail(email, emailToken, username);
        const user = yield user_service_1.default.createUser(username, email, hashedPassword, birthDate, false, emailToken, role);
        return response.status(http_1.HttpStatusCode.CREATED).json(user);
    }
    catch (error) {
        return next(error);
    }
});
const login = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = request.body;
        const isUsernameExist = yield user_service_1.default.findByUsername(username);
        if (!isUsernameExist)
            throw new error_1.ValidationError(http_1.HttpStatusCode.BAD_REQUEST, 'username', 'Username does not exist.');
        const isPasswordMatch = yield (0, hashing_1.verifyPassword)(password, isUsernameExist.password);
        if (!isPasswordMatch)
            throw new error_1.ValidationError(http_1.HttpStatusCode.BAD_REQUEST, 'password', 'Wrong password.');
        const accessToken = (0, token_1.generateAccessToken)(isUsernameExist.id, username);
        const refreshToken = (0, token_1.generateRefreshToken)(isUsernameExist.id, username);
        return response.status(http_1.HttpStatusCode.OK).json({
            id: isUsernameExist.id,
            email: isUsernameExist.email,
            username: isUsernameExist.username,
            accessToken,
            refreshToken,
            birthdate: isUsernameExist.birthdate,
            isEmailValid: isUsernameExist.isEmailValid,
            role: isUsernameExist.role,
            trainerId: isUsernameExist.trainerId
        });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = {
    register,
    login
};
//# sourceMappingURL=auth.controller.js.map