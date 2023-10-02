import { Router } from 'express';
import { loginHandler } from './auth.controllers';

const router = Router();

router.post('/login', loginHandler);

export default router;