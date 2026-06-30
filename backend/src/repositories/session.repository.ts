import { BaseRepository } from './base.repository';
import { Session, ISessionDocument } from '../models/session.model';

export class SessionRepository extends BaseRepository<ISessionDocument> {
  constructor() {
    super(Session);
  }

  async findByRefreshToken(refreshToken: string): Promise<ISessionDocument | null> {
    return this.findOne({ refreshToken });
  }

  async deleteByRefreshToken(refreshToken: string): Promise<ISessionDocument | null> {
    return this.findOne({ refreshToken }).then(async (doc) => {
      if (doc) {
        await doc.deleteOne();
      }
      return doc;
    });
  }

  async deleteByUserId(userId: string): Promise<any> {
    return this.deleteMany({ userId });
  }
}
