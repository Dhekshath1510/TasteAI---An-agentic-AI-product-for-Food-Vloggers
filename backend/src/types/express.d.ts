import { IUserDocument } from '../models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: 'admin' | 'user';
        email?: string;
      };
      file?: any;
    }
  }
}
