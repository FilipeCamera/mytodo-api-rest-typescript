import express from 'express';
import { body } from 'express-validator';
import AuthController from '../controllers/auth.controller';
import { withRefreshAuthenticated } from '../middlewares/auth.middlewares';
import TokenService from '../services/token.service';
import UserService from '../services/user.service';
const authRoutes = express.Router();

const userService = new UserService();
const tokenService = new TokenService();

const authController = new AuthController(userService, tokenService);

authRoutes.post(
  '/login',
  body('email').isEmail().notEmpty().exists(),
  body('password').notEmpty().exists().isLength({ min: 6 }),
  (req, res) => authController.login(req, res)
);

authRoutes.post('/refresh-token', withRefreshAuthenticated, (req, res) =>
  authController.refresh(req, res)
);

export default authRoutes;
