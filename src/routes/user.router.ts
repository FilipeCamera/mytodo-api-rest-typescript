import express from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/user.controller';

import MyToDoDataSource from '../database';
import Role from '../models/role';
import User from '../models/user';

const userRoutes = express.Router();

const userRepository = MyToDoDataSource.getRepository(User);
const roleRepository = MyToDoDataSource.getRepository(Role);

const userController = new UserController(userRepository, roleRepository);

userRoutes.post(
  '/users',
  body('email').isEmail().notEmpty().exists(),
  body('password').notEmpty().exists().isLength({ min: 6 }),
  userController.create
);

export default userRoutes;
