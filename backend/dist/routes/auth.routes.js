"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const authRouter = express_1.default.Router();
authRouter.post('/register', validate_1.default.userRegistration, auth_controller_1.default.register);
authRouter.post('/login', validate_1.default.userAuthentication, auth_controller_1.default.login);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map