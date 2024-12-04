"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.ApiError = void 0;
class BaseError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
class ApiError extends BaseError {
    constructor(status, message) {
        super(status, message);
        this.name = 'ApiError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
class ValidationError extends BaseError {
    constructor(status, field, message) {
        super(status, message);
        this.field = field;
        this.name = 'ValidationError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=error.js.map