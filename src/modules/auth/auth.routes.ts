import { Router } from 'express';
import { loginHandler, signupHandler, verifyEmailTokenHandler } from './auth.controllers';

const router = Router();

router.post('/signup', signupHandler);
router.post('/login', loginHandler);
router.get('/verify/email/:token', verifyEmailTokenHandler);

export default router;