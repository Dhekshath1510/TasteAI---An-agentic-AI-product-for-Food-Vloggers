import { UserRepository } from '../repositories/user.repository';
import { NotFoundError } from '../utils/appError';

export class UserService {
  private userRepository = new UserRepository();

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return user.toJSON();
  }

  async updateProfile(userId: string, updateData: any) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    // List of allowable updates for regular users
    if (updateData.fullName !== undefined) user.fullName = updateData.fullName;
    if (updateData.theme !== undefined) user.theme = updateData.theme;
    if (updateData.profileImage !== undefined) user.profileImage = updateData.profileImage;
    
    if (updateData.preferences !== undefined) {
      // Merge preferences map
      const preferences = user.preferences || {};
      user.preferences = {
        ...preferences,
        ...updateData.preferences,
      };
    }

    await user.save();
    return user.toJSON();
  }
}
