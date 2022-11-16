import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCode } from '../enums/status-code';
import brcypt from 'bcrypt';
import UserService from '../services/user.service';
import TokenService from '../services/token.service';
import refreshCookies from '../utils/refresh-cookie';

class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

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

    try {
      const { accessToken, refreshToken } = await this.tokenService.generate(user);
      refreshCookies(res, refreshToken);
      return res.status(StatusCode.OK).json({ token: accessToken });
    } catch (err) {
      res.status(StatusCode.SERVER_ERROR).json({ error: err.message });
    }
  }

  async refresh(req: Request, res: Response) {
    const ref = req.cookies['refresh-token'];
    const refreshTokenDecoded = Buffer.from(ref, 'base64').toString('binary');

    const { accessToken, refreshToken } = await this.tokenService.refresh(refreshTokenDecoded);

    refreshCookies(res, refreshToken);

    return res.status(StatusCode.OK).json({ token: accessToken });
  }
}

export default AuthController;
