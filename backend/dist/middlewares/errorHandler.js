"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const library_1 = require("@prisma/client/runtime/library");
const zod_1 = require("zod");
const error_1 = require("../utils/error");
const http_1 = require("../utils/http");
const handlePrismaError = (error) => {
    var _a;
    if (error instanceof library_1.PrismaClientKnownRequestError && ((_a = error.meta) === null || _a === void 0 ? void 0 : _a.target)) {
        switch (error.code) {
            case 'P2002':
                return {
                    status: http_1.HttpStatusCode.BAD_REQUEST,
                    field: error.meta.target,
                    message: `${error.meta.target} is already taken.`
                };
            default:
                return { status: http_1.HttpStatusCode.INTERNAL_SERVER_ERROR, message: 'Unknown prisma error code.' };
        }
    }
    else if (error instanceof library_1.PrismaClientUnknownRequestError) {
        return { status: http_1.HttpStatusCode.INTERNAL_SERVER_ERROR, message: error.message };
    }
    else {
        return { status: http_1.HttpStatusCode.INTERNAL_SERVER_ERROR, message: "Unknown prisma instance error." };
    }
};
const handleZodError = (error) => {
    const errorsMap = error.issues.map((issue) => {
        switch (issue.code) {
            case zod_1.ZodIssueCode.invalid_type:
            case zod_1.ZodIssueCode.invalid_string:
            case zod_1.ZodIssueCode.too_small:
                return { field: issue.path[0], message: issue.message };
            default:
                return { message: `unspecified zod issue error: ${issue.code}.` };
        }
    });
    return errorsMap;
};
const errorHandler = (error, _request, response, next) => {
    if (error instanceof zod_1.ZodError) {
        const zod = handleZodError(error);
        return response.status(400).json(zod);
    }
    else if (error instanceof library_1.PrismaClientUnknownRequestError || error instanceof library_1.PrismaClientKnownRequestError) {
        const { status, message } = handlePrismaError(error);
        return response.status(status).json({ message: message });
    }
    else if (error instanceof error_1.ApiError) {
        return response.status(error.status).json({ message: error.message });
    }
    else if (error instanceof error_1.ValidationError) {
        return response.status(error.status).json({ field: error.field, message: error.message });
    }
    return next(error);
};
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map