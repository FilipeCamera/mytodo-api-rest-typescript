import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Repository } from "typeorm";
import { StatusCode } from "../enums/status-code";
import User from "../models/user";
import brcypt from "bcrypt";

class AuthController {

  constructor(private readonly userRepository: Repository<User>){}

  async login(req: Request, res: Response) {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      return res.status(StatusCode.BAD_REQUEST).json({errors: errors.array()})
    }

    const {email, password} = req.body;

    const user = await this.userRepository.findOne({where: {email}});

    if(!user) {
      return res.status(StatusCode.NOT_FOUND).json({message: "User not found"})
    }

    const passwordValidate = await brcypt.compare(password, user.password);

    if(!passwordValidate) {
      return res.status(StatusCode.BAD_REQUEST).json({message: "e-mail or password incorrect"})
    }
 
  }
}

export default AuthController