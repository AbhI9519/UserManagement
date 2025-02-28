"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewPassword = exports.forgotPassword = exports.getProfile = exports.login = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signup = async (req, res) => {
    try {
        const { name, email, password, gender, contact, image } = req.body;
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const newUser = new User_1.default({ name, email, password, gender, contact, image });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("Generated Token:", token);
        res.status(200).json({ token });
        return;
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
        return;
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    try {
        if (!req.userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const user = await User_1.default.findById(req.userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProfile = getProfile;
const forgotPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!password) {
            res.status(400).json({ message: 'New password is required' });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Hash new password
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        if (!hashedPassword) {
            res.status(500).json({ message: 'Error hashing password' });
            return;
        }
        user.password = hashedPassword;
        await user.save();
        // Generate a new JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Password reset successfully', token });
        return;
    }
    catch (err) {
        console.error("Error in forgotPassword:", err);
        res.status(500).json({ message: 'Server error' });
        return;
    }
};
exports.forgotPassword = forgotPassword;
const createNewPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ message: 'Both current and new passwords are required' });
            return;
        }
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        console.log("Provided Password:", currentPassword);
        console.log("Stored Hashed Password:", user.password);
        const isMatch = await bcrypt_1.default.compare(currentPassword, user.password);
        console.log("Password Match Result:", isMatch);
        if (!isMatch) {
            res.status(400).json({ message: 'Current password is incorrect' });
            return;
        }
        // Hash new password
        const hashedNewPassword = await bcrypt_1.default.hash(newPassword, 10);
        console.log("New Hashed Password:", hashedNewPassword);
        user.password = hashedNewPassword;
        await user.save();
        // Generate a new JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Password changed successfully', token });
        return;
    }
    catch (err) {
        console.error("Error in createNewPassword:", err);
        res.status(500).json({ message: 'Server error' });
        return;
    }
};
exports.createNewPassword = createNewPassword;
