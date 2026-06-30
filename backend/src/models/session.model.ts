import mongoose, { Schema, Document } from 'mongoose';

export interface ISession {
  userId: mongoose.Types.ObjectId;
  refreshToken: string;
  ipAddress?: string;
  userAgent?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISessionDocument extends ISession, Document {}

const SessionSchema = new Schema<ISessionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatically delete when expired
    },
  },
  {
    timestamps: true,
  }
);

export const Session = mongoose.model<ISessionDocument>('Session', SessionSchema);
