import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../types/customRequest';

const authMiddleware = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
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
    const decodedData = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log("Decoded Token:", decodedData);

    // Ensure the userId exists in decodedData
    if (typeof decodedData !== "object" || !("userId" in decodedData)) {
      console.log("Invalid decoded data:", decodedData);
      res.status(400).json({ message: "Invalid token structure" });
      return;
    }

    req.userId = decodedData.userId as string;
    next();
  } catch (err) {
    console.log("JWT Verification Error:", err);
    res.status(400).json({ message: "Invalid Token" });
  }
};


export default authMiddleware;