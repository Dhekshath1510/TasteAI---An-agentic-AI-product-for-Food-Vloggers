import { BaseRepository } from './base.repository';
import { User, IUserDocument } from '../models/user.model';

export class UserRepository extends BaseRepository<IUserDocument> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string, select?: string): Promise<IUserDocument | null> {
    return this.findOne({ email }, select);
  }
}
