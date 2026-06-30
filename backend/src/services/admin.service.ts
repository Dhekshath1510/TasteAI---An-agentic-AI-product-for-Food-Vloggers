import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import { NotFoundError, BadRequestError } from '../utils/appError';

export class AdminService {
  private userRepository = new UserRepository();
  private sessionRepository = new SessionRepository();

  async getUsers(page = 1, limit = 10, search = '', role = '', status = '') {
    const filter: any = {};

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status) {
      filter.status = status;
    }

    const skip = (page - 1) * limit;

    // Retrieve documents
    const users = await this.userRepository.find(filter, undefined, {
      skip,
      limit,
      sort: { createdAt: -1 },
    });

    const total = await this.userRepository.countDocuments(filter);

    return {
      users: users.map((u) => {
        const uJson = u.toJSON();
        delete uJson.password;
        return uJson;
      }),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateUser(userId: string, adminId: string, updateData: any) {
    if (userId === adminId && updateData.role === 'user') {
      throw new BadRequestError('You cannot revoke your own admin rights');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (updateData.fullName !== undefined) user.fullName = updateData.fullName;
    if (updateData.role !== undefined) user.role = updateData.role;
    if (updateData.status !== undefined) {
      if (userId === adminId && updateData.status === 'suspended') {
        throw new BadRequestError('You cannot suspend your own admin account');
      }
      user.status = updateData.status;
    }

    await user.save();

    // If status updated to suspended, clear all sessions immediately
    if (updateData.status === 'suspended') {
      await this.sessionRepository.deleteByUserId(userId);
    }

    const userJson = user.toJSON();
    delete userJson.password;
    return userJson;
  }

  async deleteUser(userId: string, adminId: string) {
    if (userId === adminId) {
      throw new BadRequestError('You cannot delete your own admin account');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    await this.userRepository.delete(userId);
    await this.sessionRepository.deleteByUserId(userId);
  }
}
