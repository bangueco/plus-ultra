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
const error_1 = require("../utils/error");
const user_service_1 = __importDefault(require("../services/user.service"));
const http_1 = require("../utils/http");
const client_1 = require("@prisma/client");
const isEmailVerified = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = request.query.username;
    try {
        if (!username)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Username is not specified!");
        const user = yield user_service_1.default.findByUsername(String(username));
        if (!user)
            throw new error_1.ApiError(http_1.HttpStatusCode.NOT_FOUND, "User not found.");
        if (user.isEmailValid)
            return response.status(http_1.HttpStatusCode.OK).json({ verified: true });
        if (!user.isEmailValid)
            return response.status(http_1.HttpStatusCode.OK).json({ verified: false });
    }
    catch (error) {
        return next(error);
    }
});
const verifyEmail = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const emailToken = request.query.emailToken;
    const username = request.query.username;
    try {
        if (!username)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Invalid username!");
        if (!emailToken)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Invalid email token verification!");
        const user = yield user_service_1.default.findByUsername(String(username));
        if (!user)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Username not found!");
        if (user.emailToken === String(emailToken)) {
            yield user_service_1.default.updateUser(user.id, { isEmailValid: true });
            return response.status(http_1.HttpStatusCode.OK).json({ message: "Email is now verified!" });
        }
        else {
            return response.status(http_1.HttpStatusCode.BAD_REQUEST).json({ message: "Cannot verify email." });
        }
    }
    catch (error) {
        return next(error);
    }
});
const getTrainers = (_request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trainers = yield user_service_1.default.findAllTrainer();
        return response.status(http_1.HttpStatusCode.OK).json(trainers);
    }
    catch (error) {
        return next(error);
    }
});
const findUser = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = request.query.userId;
    try {
        if (!userId)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "User id is not specified!");
        const user = yield user_service_1.default.findById(Number(userId));
        if (!user)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "User not found!");
        return response.status(http_1.HttpStatusCode.OK).json(user);
    }
    catch (error) {
        return next(error);
    }
});
const joinTrainer = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, trainerId } = request.body;
    try {
        if (!userId)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "User id is not specified!");
        if (!trainerId)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Trainer id is not specified!");
        const trainer = yield user_service_1.default.findById(trainerId);
        const user = yield user_service_1.default.findById(userId);
        if (!trainer)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Trainer not found!");
        if (!user)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "User not found!");
        if (user.trainerId)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "You already have a trainer!");
        if (user.role === client_1.Role.TRAINER)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "You are a trainer and you cant join another trainer!");
        if (trainer.role === client_1.Role.USER)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Trainer id does not have a trainer role!");
        const assignTrainerToUser = yield user_service_1.default.setTrainerId(userId, trainerId);
        return response.status(http_1.HttpStatusCode.OK).json({ id: assignTrainerToUser.id, username: assignTrainerToUser.username, role: assignTrainerToUser.role, trainerId: assignTrainerToUser.trainerId });
    }
    catch (error) {
        return next(error);
    }
});
const leaveTrainer = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = request.body;
    try {
        if (!userId)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "User id is not specified!");
        const user = yield user_service_1.default.findById(userId);
        if (!user)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "User not found!");
        if (!user.trainerId)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "You are not assigned to any trainer!");
        const removeTrainerToUser = yield user_service_1.default.setTrainerId(userId, null);
        return response.status(http_1.HttpStatusCode.OK).json({ id: removeTrainerToUser.id, username: removeTrainerToUser.username, role: removeTrainerToUser.role, trainerId: removeTrainerToUser.trainerId });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = {
    isEmailVerified, verifyEmail, getTrainers, findUser, joinTrainer, leaveTrainer
};
//# sourceMappingURL=user.controller.js.map