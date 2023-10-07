import { Router } from "express";

import RelationshipControllers from "./relationship.controllers";
import { protect } from "./../../shared/middlewares/protection";
import { allowTo } from "./../../shared/middlewares/user.permissions";
import { followOrUnFollowUserValidator } from "./relationship.validator";

const router = Router({ mergeParams: true });
const relationshipControllers = new RelationshipControllers();

router.use(protect, allowTo(["User"]));

router
  .post("/", followOrUnFollowUserValidator, relationshipControllers.followOrUnFollowUser)
  .get("/loggedUser/followers", relationshipControllers.getLoggedUserFollowers)
  .get("/loggedUser/following", relationshipControllers.getLoggedUserFollowing);

export default router;
