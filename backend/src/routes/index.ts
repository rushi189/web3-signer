import { Router } from 'express';
import verifyRoutes from './verify.routes';

const router = Router();
router.use('/', verifyRoutes); // => POST /verify-signature
export default router;
