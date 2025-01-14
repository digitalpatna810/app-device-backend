import express from "express";
import { verifyJWT } from "../middlewares/auth-middleware";
import { allContacts, createContact, deleteContact, getContactById, updateContact } from "../controllers/contacts-controller";

const router = express.Router();

router.post("/create-contact", verifyJWT, createContact);
router.get("/contact-details/:contactId", verifyJWT, getContactById);
router.get("/allContacts", verifyJWT, allContacts);
router.put("/update-contact/:contactId", verifyJWT, updateContact);
router.delete("/delete-contact/:contactId", verifyJWT, deleteContact);

export default router;