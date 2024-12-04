"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const template_controller_1 = __importDefault(require("../controllers/template.controller"));
const templateRouter = express_1.default.Router();
templateRouter.get('/creator/:id', template_controller_1.default.findTemplatesByCreator);
templateRouter.get('/item/:id', template_controller_1.default.findTemplateItemByTemplateId);
templateRouter.get('/:id', template_controller_1.default.findTemplateById);
templateRouter.delete('/:id', template_controller_1.default.deleteTemplateById);
templateRouter.post('/create', template_controller_1.default.createTemplate);
exports.default = templateRouter;
//# sourceMappingURL=template.routes.js.map