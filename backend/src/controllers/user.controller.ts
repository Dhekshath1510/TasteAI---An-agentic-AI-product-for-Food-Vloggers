import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { BadRequestError } from '../utils/appError';

const userService = new UserService();

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError('User details missing from request context');
    }

    const user = await userService.getProfile(userId);
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError('User details missing from request context');
    }

    const updatedUser = await userService.updateProfile(userId, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new BadRequestError('User details missing from request context');
    }

    if (!req.file) {
      throw new BadRequestError('No file uploaded or file format invalid');
    }

    // Save avatar path (relative URL path)
    const avatarUrl = `/uploads/${req.file.filename}`;
    const updatedUser = await userService.updateProfile(userId, { profileImage: avatarUrl });

    res.status(200).json({
      status: 'success',
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: avatarUrl,
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
