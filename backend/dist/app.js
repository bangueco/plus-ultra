"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const equipment_routes_1 = __importDefault(require("./routes/equipment.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const template_routes_1 = __importDefault(require("./routes/template.routes"));
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/equipment', equipment_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/template', template_routes_1.default);
// Middlewares
app.use(errorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map