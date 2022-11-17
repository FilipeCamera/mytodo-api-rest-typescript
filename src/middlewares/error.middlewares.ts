import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../helpers/errors';

export default function HandleErrors(
  err: Error & Partial<ApiError>,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode ?? 500;
  const message = err.statusCode ? err.message : 'Internal Server Error';
  res.status(statusCode).json({ msg: message });
}
