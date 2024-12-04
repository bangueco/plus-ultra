"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const equipment_controller_1 = __importDefault(require("../controllers/equipment.controller"));
const multer_1 = __importDefault(require("multer"));
const validate_1 = __importDefault(require("../middlewares/validate"));
const equipmentRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
equipmentRouter.post('/identify', [upload.single('image'), validate_1.default.userToken], equipment_controller_1.default.identify);
exports.default = equipmentRouter;
//# sourceMappingURL=equipment.routes.js.map