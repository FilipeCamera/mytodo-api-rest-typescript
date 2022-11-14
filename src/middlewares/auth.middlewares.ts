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

  if (!refreshTokenCoded) return res.status(StatusCode.NOT_AUTHORIZED);

  const decodedRefreshToken = Buffer.from(refreshTokenCoded, 'base64').toString('binary');

  const refreshToken = await tokenService.getRefreshToken(decodedRefreshToken);

  if (!refreshToken) return res.status(StatusCode.NOT_AUTHORIZED);

  const expired = new Date(dayjs(refreshToken.expiresIn).get('date'));
  const now = new Date();
  if (expired < now) {
    await tokenService.deleteRefreshToken(refreshToken.id);
    return res.status(StatusCode.NOT_AUTHORIZED);
  }
  next();
}

export function withAccessAuthenticated(req: Request, res: Response, next: NextFunction) {
  const base_token = req.headers['authorization'];
  const [, token] = base_token.split(' ');

  try {
    const { sub, admin } = jwt.verify(token, process.env.JWT_SECRET_KEY, {
      audience: 'urn:jwt:type:access',
    }) as AccessTokenPayload;
    req.auth.user_id = sub;
    req.auth.admin = admin;
    next();
  } catch (err) {
    return res.status(StatusCode.NOT_AUTHORIZED).json({ error: err.message });
  }
}
