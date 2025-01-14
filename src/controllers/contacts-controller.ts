import { Contact } from "../models/contacts-model";
import { User } from "../models/user-model";

const contactNumberRegex = /^\d{10}$/;

export const createContact = async (req: any, res: any): Promise<void> => {
    try {
        const user = req.user;
        const { contactName, contactNumber } = req.body;
        if (!contactName || contactName.trim() === "") {
            res.status(400).json({
                status: 400,
                message: "Contact name cannot be empty",
            });
            return;
        }
        if (!contactNumber || !contactNumberRegex.test(contactNumber)) {
            res.status(400).json({
                status: 400,
                message: "Contact number must be a valid 10-digit number",
            });
            return;
        }
        const newContact = new Contact({
            contactName: contactName.trim(),
            contactNumber,
            deviceId: user.deviceId,
        });
        const savedContact = await newContact.save();
        res.status(200).json({
            status: 200,
            message: "Contact saved successfully",
            data: savedContact,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

export const getContactById = async (req: any, res: any): Promise<void> => {
    try {
        const user = req.user;
        const { contactId } = req.params;
        const { deviceId } = req.body;
        if (deviceId !== user.deviceId) {
            res.status(400).json({
                status: 400,
                message: "Device Id doesnot match"
            });
            return;
        };

        const contactDetails = await Contact.findById(contactId);
        const userDetails = await User.find({ deviceId });
        if (!contactDetails) {
            res.status(400).json({
                status: 400,
                message: "Contact unable to fetch"
            });
            return;
        }
        if (!userDetails) {
            res.status(400).json({
                status: 400,
                message: "User unable to fetch"
            });
            return;
        }
        res.status(200).json({
            status: 200,
            message: "Contact details fetched successfully",
            data: { contact: contactDetails, user: userDetails }
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
    }
};

export const allContacts = async (req: any, res: any): Promise<void> => {
    try {
        const allContacts = await Contact.find();
        if (allContacts.length === 0) {
            res.status(400).json({
                status: 400,
                message: "No contacts available",
            });
            return;
        }
        res.status(200).json({
            status: 200,
            message: "All contacts fetched successfully",
            data: allContacts
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
    }
};

export const updateContact = async (req: any, res: any): Promise<void> => {
    try {
        const { contactId } = req.params;
        const { contactName, contactNumber } = req.body;
        if (!contactName || contactName.trim() === "") {
            res.status(400).json({
                status: 400,
                message: "Contact name cannot be empty",
            });
            return;
        }
        if (!contactNumber || !contactNumberRegex.test(contactNumber)) {
            res.status(400).json({
                status: 400,
                message: "Contact number must be a valid 10-digit number",
            });
            return;
        }
        const updatedContact = await Contact.findByIdAndUpdate(contactId, {
            contactName,
            contactNumber
        },{new: true});
        if (!updatedContact) {
            res.status(400).json({
                status: 400,
                message: "Contact not found"
            });
            return;
        }
        
        res.status(200).json({
            status: 200,
            message: "Contact updated successfully",
            data: updatedContact,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
    }
};

export const deleteContact = async (req: any, res: any): Promise<void> => {
    try {
        const { contactId } = req.params;
        const deletedContact = await Contact.findByIdAndDelete(contactId);
        if (!deletedContact) {
            res.status(400).json({
                status: 400,
                message: "Contact unable to delete"
            });
            return;
        }
        res.status(200).json({
            status: 200,
            message: "Contact details deleted successfully",
            data: deletedContact
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ status: 500, message: "Internal Server Error", error: error.message });
    }
};