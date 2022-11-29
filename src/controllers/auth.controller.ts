import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { StatusCode } from '../enums/status-code';
import brcypt from 'bcrypt';
import { UserService, TokenService } from '../services';
import refreshCookies from '../utils/refresh-cookie';
import { BadRequest, NotFound } from '../helpers/errors';

class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService
  ) {}

  async login(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.array().map((error) => {
        throw new BadRequest(error.msg);
      });
    }

    const { email, password } = req.body;

    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFound('User not found');
    }

    const passwordValidate = await brcypt.compare(password, user.password);

    if (!passwordValidate) {
      throw new BadRequest('E-mail or password incorrect');
    }

    const { accessToken, refreshToken } = await this.tokenService.generate(
      user
    );

    refreshCookies(res, refreshToken);
    return res.status(StatusCode.OK).json({ token: accessToken });
  }

  async refresh(req: Request, res: Response) {
    const ref = req.cookies['refresh-token'];
    const refreshTokenDecoded = Buffer.from(ref, 'base64').toString('binary');

    const { accessToken, refreshToken } = await this.tokenService.refresh(
      refreshTokenDecoded
    );

    refreshCookies(res, refreshToken);

    return res.status(StatusCode.OK).json({ token: accessToken });
  }
}

export default AuthController;
