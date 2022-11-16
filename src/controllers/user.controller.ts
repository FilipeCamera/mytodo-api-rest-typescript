import { Request, Response } from 'express';
import { StatusCode } from '../enums/status-code';
import { validationResult } from 'express-validator';
import User from '../models/user';
//import MyToDoDataSource from '../database';
import UserService from '../services/user.service';
import RoleService from '../services/role.service';

class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService
  ) {}

  async create(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const existUser = await this.userService.findByEmail(email);

    if (existUser) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: 'User exist' });
    }

    const role = await this.roleService.findByName('USER');

    if (!role) {
      return res
        .status(StatusCode.SERVER_ERROR)
        .json('Ocorreu um erro! Tente novamente mais tarde.');
    }

    const user = this.userService.create(email, password, role);

    if (!user) {
      return res
        .status(StatusCode.SERVER_ERROR)
        .json({ error: 'Tivemos um problema ao criar o usuário' });
    }

    await this.userService.save(user);

    return res.status(StatusCode.CREATED).json({ user });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const user: User = await this.userService.findById(id);

    if (!user) {
      const users: User[] = await this.userService.findAll();
      //user = await MyToDoDataSource.getRepository(User).find();

      return res.status(StatusCode.OK).json({ users: users });
    }

    return res.status(StatusCode.OK).json({ user: user });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { email, password } = req.body;
    const { user_id, admin } = req;

    if (!user_id) {
      return res.status(StatusCode.NOT_AUTHORIZED).json({ message: 'Unauthenticated user' });
    }

    const userUpdate = await this.userService.findById(id);

    if (!userUpdate) {
      return res.status(StatusCode.BAD_REQUEST).json('User not found');
    }

    if (userUpdate.id !== user_id || admin) {
      return res
        .status(StatusCode.NOT_AUTHORIZED)
        .json({ message: 'You do not have permission to modify this user' });
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
      return res.status(StatusCode.NOT_AUTHORIZED).json({ message: 'Unauthenticated user' });
    }

    const user = await this.userService.findById(id);

    if (!user) {
      return res.status(StatusCode.NOT_FOUND).json({ message: 'User not found' });
    }

    if (user.id !== user_id || admin) {
      return res.status(StatusCode.NOT_AUTHORIZED).json({ message: 'You cannot delete this user' });
    }

    await this.userService.remove(user);

    return res.status(StatusCode.OK).json({ message: 'Deleted user' });
  }
}

export default UserController;
