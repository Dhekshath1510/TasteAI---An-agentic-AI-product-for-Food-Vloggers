import { Router } from 'express';
import { getStats, healthCheck } from '../controllers/dashboard.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Health check is public
router.get('/health', healthCheck);

// Dashboard stats require authentication
router.get('/stats', requireAuth, getStats);

export default router;
