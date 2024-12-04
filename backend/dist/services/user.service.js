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
const prismaClient_1 = __importDefault(require("../utils/lib/prismaClient"));
const findById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.findUnique({ select: {
            id: true,
            username: true,
            email: true,
            password: false,
            isEmailValid: true,
            role: true,
            trainerId: true
        }, where: { id } });
});
const findAllTrainer = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.findMany({ select: {
            id: true,
            username: true,
            email: true,
            password: false,
            isEmailValid: true,
            role: true,
            clients: true
        }, where: { role: "TRAINER" } });
});
const findByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.findUnique({ where: { username } });
});
const findByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.findUnique({ where: { email } });
});
const createUser = (username, email, password, birthdate, isEmailValid, emailToken, role) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.create({ data: { username, email, password, birthdate, isEmailValid, emailToken, role } });
});
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.update({
        where: { id },
        data
    });
});
const setTrainerId = (userId, trainerId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.user.update({ data: { trainerId }, where: { id: userId } });
});
exports.default = {
    findById, findAllTrainer, findByUsername, findByEmail, createUser, updateUser, setTrainerId
};
//# sourceMappingURL=user.service.js.map