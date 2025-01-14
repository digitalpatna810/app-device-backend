import { Router } from "express";
import { profileController, editProfile, editProfileImage } from "../controllers/profile-controllers";
import { verifyJWT } from "../middlewares/auth-middleware";

const router = Router();

router.get("/profile", verifyJWT, profileController);
router.put("/updateProfile", verifyJWT, editProfile);
router.put("/updateProfileImage", verifyJWT, editProfileImage);

export default router;