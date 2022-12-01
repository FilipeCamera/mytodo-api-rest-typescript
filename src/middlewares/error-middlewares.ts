import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../helpers/errors';

export default function HandleErrors(
  err: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode
    ? err.statusCode
    : err.name === 'TokenExpiredError'
    ? 401
    : 500;
  const message = err.statusCode
    ? err.message
    : err.name === 'TokenExpiredError'
    ? 'Token Expired'
    : 'Internal Server Error';
  res.status(statusCode).json({ error: message });
}
