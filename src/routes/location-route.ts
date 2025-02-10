import express from "express";
import { authorizeAdmin, verifyJWT } from "../middlewares/auth-middleware";
import { saveLocation, getAllLocations, getLocations, deleteLocation } from "../controllers/location-controller";

const router = express.Router();

router.post("/save-location", verifyJWT, saveLocation);
router.get("/getLocation", verifyJWT,authorizeAdmin, getLocations);
router.get("/all-location", verifyJWT,authorizeAdmin,authorizeAdmin, getAllLocations);
router.delete("/delete-location", verifyJWT,authorizeAdmin, deleteLocation);

export default router;