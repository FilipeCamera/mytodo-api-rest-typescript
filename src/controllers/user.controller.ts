import { Request, Response } from 'express';
import { StatusCode } from '../enums/status-code';
import { validationResult } from 'express-validator';
import User from '../models/user';
import UserService from '../services/user.service';
import RoleService from '../services/role.service';
import {
  BadRequest,
  NotAuthorized,
  NotFound,
  ServerError,
} from '../helpers/errors';

class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) {}

  async create(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new BadRequest('incomplete or blank fields');
    }

    const { email, password } = req.body;

    const existUser = await this.userService.findByEmail(email);

    if (existUser) {
      throw new BadRequest('User exist');
    }

    const role = await this.roleService.findByName('USER');

    if (!role) {
      throw new ServerError('Ocorreu um erro! Tente novamente mais tarde.');
    }

    const user = this.userService.create(email, password, role);

    if (!user) {
      throw new ServerError('Tivemos um problema ao criar o usuário');
    }

    await this.userService.save(user);

    return res.status(StatusCode.CREATED).json({ user });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    if (id) {
      const user: User = await this.userService.findById(id);
      if (!user) throw new NotFound('Users not found');

      return res.status(StatusCode.OK).json({ user: user });
    }

    const users: User[] = await this.userService.findAll();

    if (!users) throw new NotFound('Users not found');

    return res.status(StatusCode.OK).json({ users: users });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { email, password } = req.body;
    const { user_id, admin } = req;

    if (!user_id) {
      throw new NotAuthorized('Unauthenticated user');
    }

    const userUpdate = await this.userService.findById(id);

    if (!userUpdate) {
      throw new NotFound('User not found');
    }

    if (userUpdate.id !== user_id || admin) {
      throw new NotAuthorized('You do not have permission to modify this user');
    }

    userUpdate.email = email;
    userUpdate.password = password;

    await this.userService.save(userUpdate);

    return res.status(StatusCode.OK).json({ user: userUpdate });
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const { user_id, admin } = req;

    if (!user_id) {
      throw new NotAuthorized('Unauthenticated user');
    }

    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFound('User not found');
    }

    if (user.id !== user_id || admin) {
      throw new NotAuthorized('You cannot delete this user');
    }

    await this.userService.remove(user);

    return res.status(StatusCode.OK).json({ message: 'Deleted user' });
  }
}

export default UserController;
