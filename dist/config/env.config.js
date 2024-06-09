"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env_conf = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env_conf = {
    port: process.env.PORT || 3000,
    jwt_secret_key: process.env.JWT_SECRET_KEY || "",
    db_url: process.env.DB_URL || "",
    redis_port: process.env.REDIS_PORT || 0,
    redis_host: process.env.REDIS_HOST || "",
    redis_password: process.env.REDIS_PASSWORD || "",
    redis_uri: process.env.REDIS_URI || "",
    redis_user: process.env.REDIS_USER || "",
};
