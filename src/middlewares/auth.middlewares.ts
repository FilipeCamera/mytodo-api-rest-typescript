import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import TokenService from '../services/token.service';
import dayjs from 'dayjs';
import { NotAuthorized } from '../helpers/errors';

interface AccessTokenPayload {
  sub: string;
  admin: boolean;
}

export async function withRefreshAuthenticated(req: Request, res: Response, next: NextFunction) {
  const tokenService = new TokenService();

  const refreshTokenCoded = req.cookies['refresh-token'];

  if (!refreshTokenCoded) throw new NotAuthorized('Refresh Token not exist');

  const decodedRefreshToken = Buffer.from(refreshTokenCoded, 'base64').toString('binary');
  console.log('refresh-token' + decodedRefreshToken);
  const refreshToken = await tokenService.getRefreshToken(decodedRefreshToken);

  if (!refreshToken) throw new NotAuthorized('Refresh Token invalid');

  const expired = refreshToken.expiresIn;
  const now = dayjs(new Date()).unix();

  if (expired < now) {
    throw new NotAuthorized('Refresh Token expired');
  }
  next();
}

export function withAccessAuthenticated(req: Request, res: Response, next: NextFunction) {
  const base_token = req.headers['authorization'];

  if (!base_token) throw new NotAuthorized('Token invalid');

  const [, token] = base_token.split(' ');

  const { sub, admin } = jwt.verify(token, process.env.JWT_SECRET_KEY, {
    audience: 'urn:jwt:type:access',
  }) as AccessTokenPayload;

  req.user_id = sub;
  req.admin = admin;

  next();
}
