import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../enums/status-code';
import jwt from 'jsonwebtoken';
import TokenService from '../services/token.service';
import dayjs from 'dayjs';

interface AccessTokenPayload {
  sub: string;
  admin: boolean;
}

export async function withRefreshAuthenticated(req: Request, res: Response, next: NextFunction) {
  const tokenService = new TokenService();

  const refreshTokenCoded = req.cookies['refresh-token'];

  console.log(refreshTokenCoded);
  if (!refreshTokenCoded) return res.status(StatusCode.NOT_AUTHORIZED);

  const decodedRefreshToken = Buffer.from(refreshTokenCoded, 'base64').toString('binary');
  console.log(decodedRefreshToken);
  const refreshToken = await tokenService.getRefreshToken(decodedRefreshToken);

  console.log(refreshToken);
  if (!refreshToken) return res.status(StatusCode.NOT_AUTHORIZED).json({ error: 'Token invalid' });

  const expired = refreshToken.expiresIn;
  const now = dayjs(new Date()).unix();

  if (expired < now) {
    return res.status(StatusCode.NOT_AUTHORIZED).json({ error: 'Token expired' });
  }
  console.log('passou');
  next();
}

export function withAccessAuthenticated(req: Request, res: Response, next: NextFunction) {
  const base_token = req.headers['authorization'];
  const [, token] = base_token.split(' ');

  try {
    const { sub, admin } = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      audience: 'urn:jwt:type:access',
    }) as AccessTokenPayload;

    req.user_id = sub;
    req.admin = admin;

    next();
  } catch (err) {
    return res.status(StatusCode.NOT_AUTHORIZED).json({ error: err.message });
  }
}
