import { Router } from 'express';
import { loginHandler, signupHandler } from './auth.controllers';

const router = Router();

router.post('/signup', signupHandler);
router.post('/login', loginHandler);

export default router;