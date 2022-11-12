import express from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/user.controller';

import RoleService from '../services/role.service';
import UserService from '../services/user.service';

const userRoutes = express.Router();

const userService = new UserService();
const roleService = new RoleService();

const userController = new UserController(userService, roleService);

userRoutes.post(
  '/user',
  body('email').isEmail().notEmpty().exists(),
  body('password').notEmpty().exists().isLength({ min: 6 }),
  (req, res) => userController.create(req, res)
);

export default userRoutes;
