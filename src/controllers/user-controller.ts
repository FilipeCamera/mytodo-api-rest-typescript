import { Request, Response } from "express";
import { StatusCode } from "../enums/status-code";
import { validationResult } from "express-validator";
import { User } from "../models/user";
import { Repository } from "typeorm";
import { Role } from "../models/role";

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

    const existUser = await this.userRepository.findOne({ where: { email } });

    if (existUser) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: "User exist" });
    }

    const role = await this.roleRepository.findOne({ where: { name: "USER" } });

    console.log(role);

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
    console.log(user);

    return res.status(StatusCode.CREATED).json({ message: "created" });
  }
}

export default UserController;
