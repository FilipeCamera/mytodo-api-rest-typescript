import { StatusCode } from '../enums/status-code';

export class ApiError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class BadRequest extends ApiError {
  constructor(message: string) {
    super(message, StatusCode.BAD_REQUEST);
  }
}

export class ServerError extends ApiError {
  constructor(message: string) {
    super(message, StatusCode.SERVER_ERROR);
  }
}

export class NotAuthorized extends ApiError {
  constructor(message: string) {
    super(message, StatusCode.NOT_AUTHORIZED);
  }
}

export class NotFound extends ApiError {
  constructor(message: string) {
    super(message, StatusCode.NOT_FOUND);
  }
}
