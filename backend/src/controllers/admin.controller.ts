import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { BadRequestError } from '../utils/appError';

const adminService = new AdminService();

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const role = (req.query.role as string) || '';
    const status = (req.query.status as string) || '';

    const data = await adminService.getUsers(page, limit, search, role, status);

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;
    const adminId = req.user?.id;
    if (!adminId) {
      throw new BadRequestError('Admin details missing from request context');
    }

    const updatedUser = await adminService.updateUser(userId, adminId, req.body);

    res.status(200).json({
      status: 'success',
      message: 'User updated successfully',
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.params.id;
    const adminId = req.user?.id;
    if (!adminId) {
      throw new BadRequestError('Admin details missing from request context');
    }

    await adminService.deleteUser(userId, adminId);

    res.status(200).json({
      status: 'success',
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
