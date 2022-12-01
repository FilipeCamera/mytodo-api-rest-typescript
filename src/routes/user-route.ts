import express from 'express';
import { body } from 'express-validator';
import UserController from '../controllers/user-controller';
import { withAccessAuthenticated } from '../middlewares/auth-middlewares';

import { UserService, RoleService } from '../services';

const userRoutes = express.Router();

const userService = new UserService();
const roleService = new RoleService();

const userController = new UserController(userService, roleService);

userRoutes.post(
  '/users',
  body('email').isEmail().notEmpty().exists(),
  body('password').notEmpty().exists().isLength({ min: 6 }),
  (req, res) => userController.create(req, res)
);

userRoutes.get('/users', withAccessAuthenticated, (req, res) =>
  userController.read(req, res)
);
userRoutes.get('/users/:id', withAccessAuthenticated, (req, res) =>
  userController.read(req, res)
);
userRoutes.put('/users/:id', withAccessAuthenticated, (req, res) =>
  userController.update(req, res)
);

userRoutes.patch('/users/:id', withAccessAuthenticated, (req, res) =>
  userController.update(req, res)
);

userRoutes.delete('/users/:id', withAccessAuthenticated, (req, res) =>
  userController.delete(req, res)
);

export default userRoutes;
