import { Router } from 'express';
import { getProfile, updateProfile, uploadAvatar } from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateProfileSchema } from '../validations/user.validation';
import { upload } from '../config/multer';

const router = Router();

router.use(requireAuth);

router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.post('/profile/avatar', upload.single('avatar'), uploadAvatar);

export default router;
