import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/appError';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token missing or invalid');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Authentication token missing');
    }

    const payload = verifyAccessToken(token);
    
    // Verify user exists and is active in database
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedError('User account not found');
    }

    if (user.status === 'suspended') {
      throw new ForbiddenError('Your account has been suspended. Please contact support.');
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (roles: Array<'admin' | 'user'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError('You do not have permission to access this resource'));
    }

    next();
  };
};
