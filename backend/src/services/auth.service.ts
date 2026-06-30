import { UserRepository } from '../repositories/user.repository';
import { SessionRepository } from '../repositories/session.repository';
import { BadRequestError, UnauthorizedError, ConflictError } from '../utils/appError';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { logger } from '../config/logger';

export class AuthService {
  private userRepository = new UserRepository();
  private sessionRepository = new SessionRepository();

  async register(fullName: string, email: string, password: string) {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError('A user with this email address already exists');
    }

    // Default first user to Admin for ease of testing Admin capabilities
    const usersCount = await this.userRepository.countDocuments({});
    const role = usersCount === 0 ? 'admin' : 'user';

    const user = await this.userRepository.create({
      fullName,
      email,
      password,
      role,
    });

    const userJson = user.toJSON();
    delete userJson.password;
    return userJson;
  }

  async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    // We select password explicitly because it's not selected by default in User Schema
    const user = await this.userRepository.findByEmail(email, '+password');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (user.status === 'suspended') {
      throw new UnauthorizedError('Your account has been suspended. Please contact support.');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const payload = { userId: user.id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Save refresh token session (expires in 7 days by default)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepository.create({
      userId: user._id,
      refreshToken,
      ipAddress,
      userAgent,
      expiresAt,
    });

    const userJson = user.toJSON();
    delete userJson.password;

    return {
      user: userJson,
      accessToken,
      refreshToken,
    };
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return;
    await this.sessionRepository.deleteByRefreshToken(refreshToken);
  }

  async refresh(refreshToken: string, ipAddress?: string, userAgent?: string) {
    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token is required');
    }

    // Verify refresh token in database
    const session = await this.sessionRepository.findByRefreshToken(refreshToken);
    if (!session) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    // Verify token payload
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(payload.userId);
      if (!user || user.status === 'suspended') {
        throw new UnauthorizedError('User account is invalid or suspended');
      }

      // Generate new tokens
      const tokenPayload = { userId: user.id, role: user.role };
      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      // Rotate refresh token in session
      session.refreshToken = newRefreshToken;
      session.ipAddress = ipAddress || session.ipAddress;
      session.userAgent = userAgent || session.userAgent;
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      session.expiresAt = expiresAt;

      await session.save();

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          theme: user.theme,
          profileImage: user.profileImage,
        },
      };
    } catch (error) {
      // Clean up invalid session
      await this.sessionRepository.deleteByRefreshToken(refreshToken);
      throw new UnauthorizedError('Session expired. Please login again.');
    }
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // To prevent email enumeration, return success message even if email doesn't exist
      logger.warn(`Forgot password requested for non-existent email: ${email}`);
      return;
    }

    // Generate short-lived reset token (15 mins)
    const resetOptions: SignOptions = { expiresIn: '15m' };
    const resetToken = jwt.sign({ email: user.email }, env.JWT_REFRESH_SECRET, resetOptions);

    // In a real application, we would send this link via email.
    // Here we log the link to console and logs/combined.log so it can be copied.
    const resetLink = `${env.CORS_ORIGIN}/reset-password?token=${resetToken}`;
    logger.info(`------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`);
    logger.info(`PASSWORD RESET REQUEST RECEIVED FOR USER: ${email}`);
    logger.info(`Reset Link: ${resetLink}`);
    logger.info(`------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`);
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as { email: string };
      const user = await this.userRepository.findByEmail(payload.email);
      if (!user) {
        throw new BadRequestError('Invalid reset token or user not found');
      }

      user.password = newPassword;
      await user.save();

      // Revoke all existing sessions for this user for security
      await this.sessionRepository.deleteByUserId(user.id);
    } catch (error) {
      throw new BadRequestError('Invalid or expired reset token');
    }
  }
}
