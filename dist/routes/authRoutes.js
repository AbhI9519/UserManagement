"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = __importDefault(require("../middlewares/authMiddleware"));
const router = express_1.default.Router();
router.post('/signup', authController_1.signup);
router.post('/login', authController_1.login);
router.get('/profile', authMiddleware_1.default, authController_1.getProfile);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/create-new-password', authMiddleware_1.default, authController_1.createNewPassword);
exports.default = router;
