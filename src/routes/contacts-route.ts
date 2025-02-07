import express from "express";
import { authorizeAdmin, verifyJWT } from "../middlewares/auth-middleware";
import { allContacts, saveContact, deleteContact, getContactById, updateContact } from "../controllers/contacts-controller";

const router = express.Router();

router.post("/create-contact", verifyJWT, saveContact);
router.get("/contact-details/:contactId", verifyJWT, getContactById);
// router.get("/allContacts", verifyJWT,authorizeAdmin, allContacts);
router.get("/allContacts", allContacts)
router.put("/update-contact/:contactId", verifyJWT, updateContact);
router.delete("/delete-contact/:contactId", verifyJWT, deleteContact);

export default router;