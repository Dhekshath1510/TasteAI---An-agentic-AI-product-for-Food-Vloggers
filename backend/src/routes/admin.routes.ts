import { Router } from 'express';
import { getUsers, updateUser, deleteUser } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { adminUpdateUserSchema } from '../validations/user.validation';

const router = Router();

router.use(requireAuth);
router.use(requireRole(['admin']));

router.get('/users', getUsers);
router.put('/users/:id', validate(adminUpdateUserSchema), updateUser);
router.delete('/users/:id', deleteUser);

export default router;
