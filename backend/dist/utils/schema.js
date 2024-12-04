"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
// If year is 2024, we minus it with 15, therefore adding age limits.
// const currentYear = new Date().getFullYear() - 15;
// const maxDate = new Date(currentYear, 11, 31);
const UserSchema = {
    username: zod_1.default.string({ message: 'Username is required.' })
        .min(3, { message: 'Username must be atleast 3 characters or more.' })
        .max(16, { message: 'Username cannot exceed 17 characters.' }),
    password: zod_1.default.string({ message: 'Password is required.' })
        .min(8, { message: 'Password must contain atleast 8 characters or more.' }),
    email: zod_1.default.string({ message: 'Email is required.' }).email({ message: 'Invalid email format.' }),
    birthdate: zod_1.default.string().datetime(),
    role: zod_1.default.enum(['USER', 'TRAINER'])
};
exports.UserSchema = UserSchema;
//# sourceMappingURL=schema.js.map