import mongoose, { Schema, Document } from "mongoose";

interface ILocationEntry {
    _id?: string;
    latitude: number;
    longitude: number;
    timestamp: Date;
}

export interface IDeviceLocation extends Document {
    deviceId: string;
    locations: ILocationEntry[];
}

const LocationSchema: Schema = new Schema({
    deviceId: { type: String, required: true, unique: true },
    locations: [
        {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
            timestamp: { type: Date, required: true, default: Date.now },
        },
    ],
});

export default mongoose.model<IDeviceLocation>("DeviceLocation", LocationSchema);
