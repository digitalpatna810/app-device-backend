import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document{
    _id: mongoose.Types.ObjectId;
    contactName: string;
    contactNumber: number;
    deviceId: string;
};

const contactSchema: Schema = new mongoose.Schema({
    contactName: {
        type: String, required: true, validate: {
            validator: function (value: string) {
                return value.length > 0;
            },
            message: "Contact name cannot be blank"
        }
    },
    contactNumber: {
        type: Number, required: true,  match: [/^\d{10}$/, "Phone number must be a valid 10-digit number."],
    },
    deviceId: { type: String, required: true}
});

export const Contact = mongoose.model<IContact>('Contact', contactSchema);