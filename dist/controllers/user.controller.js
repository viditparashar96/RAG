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
exports.currentUser = exports.loginUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json("Please fill all fields");
        }
        const userfound = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (userfound) {
            return res.status(400).json("User already exists");
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const createdUser = yield prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
            },
        });
        res.status(201).json(createdUser);
        prisma.$disconnect();
    }
    catch (error) {
        console.log(error);
        prisma.$disconnect();
        return res.status(500).json("Internal Server Error");
    }
});
exports.createUser = createUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return res.status(400).json("User not found");
        }
        const validPassword = yield bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json("Invalid Password");
        }
        const payload = {
            id: user.id,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d",
        });
        res.status(200).json({
            message: "Login Successful",
            token: token,
        });
        prisma.$disconnect();
    }
    catch (error) {
        console.log(error);
        prisma.$disconnect();
    }
});
exports.loginUser = loginUser;
const currentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({
            user: req.user,
        });
        prisma.$disconnect();
    }
    catch (error) {
        console.log(error);
        prisma.$disconnect();
    }
});
exports.currentUser = currentUser;
