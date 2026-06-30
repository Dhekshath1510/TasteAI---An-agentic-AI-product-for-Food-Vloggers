import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { env } from '../config/env';

const authService = new AuthService();

const setRefreshTokenCookie = (res: Response, token: string, rememberMe = false) => {
  const cookieOptions: any = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth', // Stored specifically for auth requests
  };

  if (rememberMe) {
    // 7 days cookie expiration
    cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
  }

  res.cookie('refreshToken', token, cookieOptions);
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { fullName, email, password } = req.body;
    const user = await authService.register(fullName, email, password);
    
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, rememberMe } = req.body;
    const ipAddress = req.ip || '';
    const userAgent = req.get('user-agent') || '';

    const { user, accessToken, refreshToken } = await authService.login(
      email,
      password,
      ipAddress,
      userAgent
    );

    setRefreshTokenCookie(res, refreshToken, rememberMe);

    res.status(200).json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
    });

    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    const ipAddress = req.ip || '';
    const userAgent = req.get('user-agent') || '';

    const { accessToken, refreshToken: newRefreshToken, user } = await authService.refresh(
      token,
      ipAddress,
      userAgent
    );

    // Keep original cookie duration config or default to session
    setRefreshTokenCookie(res, newRefreshToken, true);

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        user,
      },
    });
  } catch (error) {
    // Clear cookies upon failed refresh attempts
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth',
    });
    next(error);
  }
};

export const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);

    res.status(200).json({
      status: 'success',
      message: 'If a user exists with this email, a password reset link has been logged.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);

    res.status(200).json({
      status: 'success',
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};
