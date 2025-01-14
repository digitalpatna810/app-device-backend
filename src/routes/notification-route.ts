import express from "express";

import { verifyJWT } from "../middlewares/auth-middleware";
import { saveDeviceId } from "../controllers/notification-controller";

const router = express.Router();

router.put('/save-deviceId', verifyJWT, saveDeviceId);

export default router;