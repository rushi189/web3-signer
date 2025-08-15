import { Router } from 'express';
import { validate } from '../middlewares/validate.middleware';
import { VerifyBody } from '../validators/verify.schema';
import { verifyController } from '../controllers/verify.controller';

const router = Router();
router.post('/verify-signature', validate(VerifyBody), verifyController);
export default router;
