import { Contact } from "../models/contacts-model";
import { User } from "../models/user-model";

const contactNumberRegex = /^\d{10}$/;

export const saveContact = async (req: any, res: any): Promise<void> => {
    try {
      const { users} = req.body;
        const deviceId = req.user?.deviceId;
      if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ message: "Invalid input. Please provide an array of users." });
      }
 
      if (!deviceId) {
        return res.status(400).json({ message: "Device ID is required." });
      }
 
     
      const usersWithDeviceId = users.map(user => ({
        ...user,
        deviceId,
      }));
 
      const contactNumbers = usersWithDeviceId.map(user => user.contactNumber);
      console.log("Contact Numbers:", contactNumbers);
 
     
      const existingUsers = await Contact.find({ contactNumber: { $in: contactNumbers } });
      console.log("Existing Users:", existingUsers);
 
      const existingContactNumbers = existingUsers.map(user => user.contactNumber);
 
     
      const newUsers = usersWithDeviceId.filter(user => !existingContactNumbers.includes(user.contactNumber));
 
      if (newUsers.length > 0) {
       
        await Contact.insertMany(newUsers);
      }
 
      res.status(201).json({
        message: `${newUsers.length} users added successfully.`,
        addedUsers: newUsers,
        skippedUsers: existingContactNumbers.length,
      });
    } catch (e: any) {
      console.error("Error occurred while saving contacts:", e);
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: e.message,
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