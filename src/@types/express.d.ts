declare namespace Express {
  export interface Request {
    auth: {
      user_id: string;
      admin: boolean;
    };
  }
}
