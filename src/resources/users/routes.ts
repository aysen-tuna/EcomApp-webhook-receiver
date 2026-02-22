import { Router } from 'express';
import userController from './controller';

const router = Router();

router.route('/user').get(userController.getAll);

export default router;
