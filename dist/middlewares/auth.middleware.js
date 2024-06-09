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
exports.authenticateUser = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers.authorization;
        const revisedToken = token === null || token === void 0 ? void 0 : token.replace("Bearer ", "");
        console.log(revisedToken);
        if (!revisedToken) {
            return res.status(401).json("Access Denied (Not Authorized)");
        }
        const decoded = jsonwebtoken_1.default.verify(revisedToken, process.env.JWT_SECRET_KEY);
        console.log(decoded);
        const foundedUser = yield prisma.user.findUnique({
            where: {
                id: parseInt(decoded.id),
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        if (!foundedUser) {
            return res.status(404).json("User not found");
        }
        req.user = foundedUser;
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json("token is not valid");
    }
});
exports.authenticateUser = authenticateUser;
