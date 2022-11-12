import express from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/auth.controller';
import UserService from '../services/user.service';
const authRoutes = express.Router();

const userService = new UserService();

const authController = new AuthController(userService);

authRoutes.post(
  '/login',
  body('email').isEmail().notEmpty().exists(),
  body('password').notEmpty().exists().isLength({ min: 6 }),
  (req, res) => authController.login(req, res)
);

export default authRoutes;
