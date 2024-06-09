"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.route("/register").post(user_controller_1.createUser);
router.route("/login").post(user_controller_1.loginUser);
router.route("/currentUser").get(auth_middleware_1.authenticateUser, user_controller_1.currentUser);
module.exports = router;
