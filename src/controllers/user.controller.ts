import { Request, Response } from "express";
import { StatusCode } from "../enums/status-code";
import { validationResult } from "express-validator";
import User from "../models/user";
import MyToDoDataSource from "../database";
import Role from "../models/role";
import { Repository } from "typeorm";

class UserController {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly roleRepository: Repository<Role>
  ) {}

  async create(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const existUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existUser) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: "User exist" });
    }

    const role = await this.roleRepository.findOne({
      where: { name: "USER" },
    });

    if (!role) {
      return res
        .status(StatusCode.SERVER_ERROR)
        .json("Ocorreu um erro! Tente novamente mais tarde.");
    }

    const user = this.userRepository.create({
      email,
      password,
      role,
    });

    if (!user) {
      return res
        .status(StatusCode.SERVER_ERROR)
        .json({ error: "Tivemos um problema ao criar o usuário" });
    }

    await this.userRepository.save(user);

    return res.status(StatusCode.CREATED).json({ user });
  }

  async read(req: Request, res: Response) {
    const { id } = req.params;

    const user: User = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      const users: User[] = await this.userRepository.find();
      //user = await MyToDoDataSource.getRepository(User).find();

      return res.status(StatusCode.OK).json({ users: users });
    }

    return res.status(StatusCode.OK).json({ user: user });
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { email, password } = req.body;
    const {user_id, role} = req.auth;

    if(!user_id) {
      return res.status(StatusCode.NOT_AUTHORIZED).json({message: "Unauthenticated user"})
    }

    const userUpdate = await this.userRepository.findOne({ where: { id } });

    if (!userUpdate) {
      return res.status(StatusCode.BAD_REQUEST).json("User not found");
    }

    if(userUpdate.id !== user_id || role !== "ADMIN") {
      return res.status(StatusCode.NOT_AUTHORIZED).json({message: "You do not have permission to modify this user"})
    }
    
    userUpdate.email = email;
    userUpdate.password = password;

    await this.userRepository.save(userUpdate);

    return res.status(StatusCode.OK).json({ user: userUpdate });
  }

  async delete(req: Request, res: Response) {
    const {id} = req.params;
    const {user_id, role} = req.auth;

    if(!user_id) {
      return res.status(StatusCode.NOT_AUTHORIZED).json({message: "Unauthenticated user"})
    }

    const user = await this.userRepository.findOne({where: {id}});

    if(!user) {
      return res.status(StatusCode.NOT_FOUND).json({message: "User not found"})
    }

    if(user.id !== user_id || role !== "ADMIN") {
      return res.status(StatusCode.NOT_AUTHORIZED).json({message: "You cannot delete this user"})
    }

    await this.userRepository.remove(user);
    
    return res.status(StatusCode.OK).json({ message: "Deleted user" });
  }
}

export default UserController;
