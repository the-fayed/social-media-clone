import { Router } from "express";

import LikeControllers from "./like.controllers";
import { protect } from "./../../shared/middlewares/protection";
import { allowTo } from "./../../shared/middlewares/user.permissions";

const router = Router({ mergeParams: true });
const likeControllers = new LikeControllers();

router.use(protect, allowTo(["User"]));

router.route("/").get(likeControllers.getAllLikes).post(likeControllers.addOrRemoveLike);

export default router;
