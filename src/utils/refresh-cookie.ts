import { Response } from 'express';

export default function refreshCookies(res: Response, refreshToken: string) {
  res.cookie('refresh-token', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: true,
    encode: (e) => Buffer.from(e).toString('base64'),
  });
}
