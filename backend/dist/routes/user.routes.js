"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const userRouter = express_1.default.Router();
userRouter.get('/', user_controller_1.default.findUser);
userRouter.get('/email/status', user_controller_1.default.isEmailVerified);
userRouter.get('/email/verify', user_controller_1.default.verifyEmail);
userRouter.get('/trainers', user_controller_1.default.getTrainers);
userRouter.post('/trainers/join', user_controller_1.default.joinTrainer);
userRouter.post('/trainers/leave', user_controller_1.default.leaveTrainer);
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map