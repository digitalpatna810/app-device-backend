import DeviceLocation from "../models/location-model";

export const saveLocation = async (req: any, res: any): Promise<void> => {
    try {
        const deviceId = req.user?.deviceId;
        console.log(req.user);
        const { latitude, longitude, timestamp } = req.body;
        if (!deviceId) {
            res.status(400).json({
                status: 400,
                message: "Device Id is required",
            });
            return;
        }
        if (!latitude || !longitude) {
            res.status(400).json({
                status: 400,
                message: "All location info required",
            });
            return;
        }
        let device = await DeviceLocation.findOne({ deviceId });

        if (!device) {
            device = new DeviceLocation({ deviceId, locations: [{ latitude, longitude, timestamp }] });
        } else {
            device.locations.push({ latitude, longitude, timestamp });
        }
        await device.save();
        res.status(201).json({
            status: 201,
            message: "Location saved successfully",
            data: device
        })

    } catch (error:any) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const getLocations = async (req: any, res: any): Promise<void> => {
    try {
        const { deviceId } = req.body;
        if (!deviceId) return res.status(400).json({status: 400, message: "deviceId is required in the request body" });

        const device = await DeviceLocation.findOne({ deviceId });
        if (!device) return res.status(400).json({status: 400, message: "Device not found" });

        res.status(200).json({
            status: 200,
            message: "Device locations retrieved successfully",
            data: device
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        })        
    }
}

export const getAllLocations = async (req: any, res: any): Promise<void> => {
    try {
        const allDevicesLocations = await DeviceLocation.find();
        if (allDevicesLocations.length == 0) {
            res.status(400).json({
                status: 400,
                message: "No device locations found"
            });
            return;
        }
        res.status(200).json({
            status: 200,
            message: "All device locations retrieved successfully",
            data: allDevicesLocations
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const deleteLocation = async (req: any, res: any): Promise<void> => {
    try {
        const { deviceId, locationId } = req.body;
        if (!deviceId || !locationId) return res.status(400).json({ error: "deviceId and locationId are required" });
        const device = await DeviceLocation.findOne({ deviceId });
        if (!device) return res.status(400).json({status: 400, message: "Device not found" });
        device.locations = device.locations.filter(location => location._id?.toString() !== locationId);
        await device.save();
        res.status(200).json({ message: "Location entry deleted successfully", device });
    } catch (error) {
        res.status(500).json({status: 500, message: "Server Error" });
    }
}