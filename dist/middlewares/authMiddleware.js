"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No token provided or incorrect format");
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    const token = authHeader.split(" ")[1];
    console.log("Token received:", token);
    try {
        console.log("Verifying Token...");
        const decodedData = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decodedData);
        // Ensure the userId exists in decodedData
        if (typeof decodedData !== "object" || !("userId" in decodedData)) {
            console.log("Invalid decoded data:", decodedData);
            res.status(400).json({ message: "Invalid token structure" });
            return;
        }
        req.userId = decodedData.userId;
        next();
    }
    catch (err) {
        console.log("JWT Verification Error:", err);
        res.status(400).json({ message: "Invalid Token" });
    }
};
exports.default = authMiddleware;
