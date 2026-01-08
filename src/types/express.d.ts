import type { User } from 'src/users/domain/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username?: string;
      };
    }
  }
}

export {};
