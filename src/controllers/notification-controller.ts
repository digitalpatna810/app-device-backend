import { User } from "../models/user-model";

export const saveDeviceId = async (req: any, res: any): Promise<void>=>{
    try {
        const {fcmToken} = req.body;
        const userId = req.user?.userId;
        console.log(userId, fcmToken);
        if (!userId || !fcmToken) {
          return res.status(400).json({ message: "userId and fcmToken are required." });
        }
    
        const user = await User.findByIdAndUpdate(
          userId,
          { deviceId: fcmToken },
          { new: true }
        );
    
        if (!user) {
          return res.status(400).json({ message: "User not found." });
        }
    
        res.status(200).json({ message: "FCM token saved successfully.", data: user });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
      }
}