import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../repositories/user.repository';
import os from 'os';

const userRepository = new UserRepository();

export const healthCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const totalUsers = await userRepository.countDocuments({});
    const activeUsers = await userRepository.countDocuments({ status: 'active' });
    const adminCount = await userRepository.countDocuments({ role: 'admin' });
    const userCount = await userRepository.countDocuments({ role: 'user' });

    // Mock/Placeholder statistics for future AI and Instagram modules
    // This allows the dashboard and frontend components to have real values to show
    const placeholderStats = {
      instagramDiscoveryAgent: {
        status: 'idle',
        lastRun: null,
        profilesScrapedCount: 0,
        postsAnalyzedCount: 0,
        locationsDiscoveredCount: 0,
      },
      restaurantIntelligenceAgent: {
        status: 'idle',
        restaurantsIndexedCount: 0,
        menuItemsExtractedCount: 0,
      },
      chefAgent: {
        status: 'idle',
        recipesCreatedCount: 0,
        nutritionalAnalysisCount: 0,
      },
      recommendationAgent: {
        status: 'idle',
        recommendationsDeliveredCount: 0,
      },
      system: {
        platform: os.platform(),
        release: os.release(),
        freeMemoryGB: Math.round((os.freemem() / (1024 * 1024 * 1024)) * 100) / 100,
        totalMemoryGB: Math.round((os.totalmem() / (1024 * 1024 * 1024)) * 100) / 100,
        cpuUsagePercentage: 1.4, // Mock CPU usage
      },
    };

    res.status(200).json({
      status: 'success',
      data: {
        userStats: {
          totalUsers,
          activeUsers,
          adminCount,
          userCount,
        },
        aiStats: placeholderStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
