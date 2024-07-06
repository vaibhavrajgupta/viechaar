import { Router } from "express";
import {
	checkAvailability,
	followUnfollowUser,
	getUserProfile,
	loginUser,
	logoutUser,
	signupUser,
    updateUser,
} from "../controllers/userController.js";
import protectedRoute from "../middlewares/protectedRoute.js";

const router = Router();

router.route("/signup").post(signupUser);
router.route("/check-availability").get(checkAvailability);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/profile/:query").get(getUserProfile);


// router.use(protectedRoute);
router.route("/update/:id").put(protectedRoute, updateUser);
// router.route("/suggested").get(getSuggestedUsers);
router.route("/follow/:id").post(protectedRoute, followUnfollowUser);
// router.route("/freeze").put(freezeAccount);

export default router;
