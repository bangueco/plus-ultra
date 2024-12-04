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
const template_service_1 = __importDefault(require("../services/template.service"));
const error_1 = require("../utils/error");
const http_1 = require("../utils/http");
const findTemplateById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        if (!id)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Template id is not specified!");
        const template = yield template_service_1.default.findTemplateById(Number(id));
        if (!template)
            throw new error_1.ApiError(http_1.HttpStatusCode.NOT_FOUND, "Template not found!");
        return response.status(http_1.HttpStatusCode.OK).json(template);
    }
    catch (error) {
        return next(error);
    }
});
const findTemplatesByCreator = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        if (!id)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Creator id is not specified!");
        const templateCreator = yield template_service_1.default.findTemplatesByCreatorId(Number(id));
        if (!templateCreator)
            throw new error_1.ApiError(http_1.HttpStatusCode.NOT_FOUND, "Creator not found!");
        return response.status(http_1.HttpStatusCode.OK).json(templateCreator);
    }
    catch (error) {
        return next(error);
    }
});
const findTemplateItemByTemplateId = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        if (!id)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Template id is not specified!");
        const templateItems = yield template_service_1.default.findTemplateItemsByTemplateId(Number(id));
        if (!templateItems)
            throw new error_1.ApiError(http_1.HttpStatusCode.NOT_FOUND, "Creator not found!");
        return response.status(http_1.HttpStatusCode.OK).json(templateItems);
    }
    catch (error) {
        return next(error);
    }
});
const createTemplate = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { template_name, custom, difficulty, creatorId, templateItems } = request.body;
    try {
        if (!template_name || !custom || !difficulty || !creatorId || !templateItems)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Some fields are required!");
        if (!Array.isArray(templateItems))
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "templateItems field must be an array!");
        const newTemplate = yield template_service_1.default.createTemplate(template_name, custom, difficulty, creatorId);
        templateItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield template_service_1.default.createTemplateItem(item.item_name, item.muscleGroup, newTemplate.template_id, item.exercise_id);
        }));
        return response.status(http_1.HttpStatusCode.OK).json({ message: "Workout template created successfully!" });
    }
    catch (error) {
        return next(error);
    }
});
const deleteTemplateById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = request.params;
    try {
        if (!id)
            throw new error_1.ApiError(http_1.HttpStatusCode.BAD_REQUEST, "Template id is not specified!");
        const removeTemplate = yield template_service_1.default.deleteTemplate(Number(id));
        return response.status(http_1.HttpStatusCode.OK).json(removeTemplate);
    }
    catch (error) {
        return next(error);
    }
});
exports.default = {
    findTemplateById, findTemplatesByCreator, findTemplateItemByTemplateId, createTemplate, deleteTemplateById
};
//# sourceMappingURL=template.controller.js.map