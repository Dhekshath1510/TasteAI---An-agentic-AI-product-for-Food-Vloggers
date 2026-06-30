import { Router } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import adminRouter from './admin.routes';
import dashboardRouter from './dashboard.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/admin', adminRouter);
router.use('/dashboard', dashboardRouter);

export default router;
