"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envVars = zod_1.default.object({
    LOCAL_DB_USER: zod_1.default.string(),
    LOCAL_DB_DATABASE: zod_1.default.string(),
    LOCAL_DB_PORT: zod_1.default.string(),
});
const parse = envVars.parse(process.env);
exports.env = {
    local: Object.fromEntries(Object.entries(parse).filter(([key]) => key.startsWith("LOCAL")))
};
