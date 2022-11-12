import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCode } from '../enums/status-code';
import brcypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from '../services/user.service';

class AuthController {
  constructor(private readonly userService: UserService) {}

  async login(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      return res.status(StatusCode.NOT_FOUND).json({ message: 'E-mail or password incorrect' });
    }

    const passwordValidate = await brcypt.compare(password, user.password);

    if (!passwordValidate) {
      return res.status(StatusCode.BAD_REQUEST).json({ message: 'E-mail or password incorrect' });
    }

    const token = jwt.sign({ role: user.role.name }, process.env.JWT_SECRET_KEY, {
      subject: user.id,
      expiresIn: '1h',
    });

    return res.status(StatusCode.OK).json({ token });
  }
}

export default AuthController;
