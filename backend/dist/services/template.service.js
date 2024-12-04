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
const findTemplateById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.template.findUnique({ where: { template_id: id } });
});
const findTemplatesByCreatorId = (creatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.template.findMany({ where: { creatorId } });
});
const findTemplateItemsByTemplateId = (templateId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.templateItem.findMany({ where: { template_id: templateId } });
});
const createTemplate = (templateName, custom, difficulty, creatorId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.template.create({ data: {
            template_name: templateName,
            custom,
            difficulty,
            creatorId
        } });
});
const createTemplateItem = (templateItemName, muscleGroup, templateId, exerciseId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.templateItem.create({
        data: {
            template_item_name: templateItemName,
            muscle_group: muscleGroup,
            template_id: templateId,
            exercise_id: exerciseId
        }
    });
});
const deleteTemplate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaClient_1.default.templateItem.deleteMany({ where: { template_id: id } });
    return yield prismaClient_1.default.template.delete({ where: { template_id: id } });
});
const deleteTemplateItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prismaClient_1.default.templateItem.delete({ where: { template_item_id: id } });
});
exports.default = {
    findTemplateById, findTemplatesByCreatorId, findTemplateItemsByTemplateId, createTemplate, createTemplateItem, deleteTemplate, deleteTemplateItem
};
//# sourceMappingURL=template.service.js.map