import { Router } from 'express';
import MessageControllers from './message.controllers';

import { protect } from '../../shared/middlewares/protection';
import { allowTo } from '../../shared/middlewares/user.permissions';


const router = Router({mergeParams: true});
const messageControllers = new MessageControllers();


router.use(protect, allowTo(['User']))

router.route('/').post(messageControllers.sendMessage).get(messageControllers.getMessagesInSpecificConversation);

export default router;