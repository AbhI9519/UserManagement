import express, { Request, Response } from 'express';
import { signup, login, getProfile, forgotPassword, createNewPassword } from '../controllers/authController';
import authMiddleware from '../middlewares/authMiddleware';
import { CustomRequest } from '../types/customRequest';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.post('/forgot-password', forgotPassword);
router.post('/create-new-password', authMiddleware, createNewPassword);


export default router;
