import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../types/customRequest';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, gender, contact, image } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    const newUser = new User({ name, email, password, gender, contact, image });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    console.log("Generated Token:", token);
    res.status(200).json({ token });
    return;
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const getProfile = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!password) {
      res.status(400).json({ message: 'New password is required' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      res.status(500).json({ message: 'Error hashing password' });
      return;
    }

    user.password = hashedPassword;
    await user.save();

    // Generate a new JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.status(200).json({ message: 'Password reset successfully', token });
    return;
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};


export const createNewPassword = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Both current and new passwords are required' });
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    console.log("Provided Password:", currentPassword);
    console.log("Stored Hashed Password:", user.password);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    console.log("New Hashed Password:", hashedNewPassword);

    user.password = hashedNewPassword;
    await user.save();

    // Generate a new JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.status(200).json({ message: 'Password changed successfully', token });
    return;
  } catch (err) {
    console.error("Error in createNewPassword:", err);
    res.status(500).json({ message: 'Server error' });
    return;
  }
};
