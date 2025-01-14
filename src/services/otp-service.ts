import admin from "../config/firebase";

export const sendTokenForAuth = async (phoneNumber: string) => {
  try {
    // Ensure phone number is in E.164 format
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      throw new Error(
        "Phone number must be in E.164 format (e.g., +1234567890)."
      );
    }
    let user;
    try {
      user = await admin.auth().getUserByPhoneNumber(phoneNumber);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        console.log("No user found. Creating a new one...");
        user = await admin.auth().createUser({ phoneNumber });
      } else {
        throw error;
      }
    }
    const customToken = await admin.auth().createCustomToken(user.uid);
    console.log(user.uid);
    return { customToken, user_uid: user.uid };
  } catch (error: any) {
    console.error("Error sending custom token or authenticating phone number:", error.message);
    throw new Error("Failed to send custom token or authenticate phone number.");
  }
};
export const sendToken = async (phoneNumber: string) => {
  try {
    // Ensure phone number is in E.164 format
    if (!/^\+?[1-9]\d{1,14}$/.test(phoneNumber)) {
      throw new Error(
        "Phone number must be in E.164 format (e.g., +1234567890)."
      );
    }
    const  user = await admin.auth().getUserByPhoneNumber(phoneNumber);
    const customToken = await admin.auth().createCustomToken(user.uid);
    console.log(user.uid);
    return { customToken, user_uid: user.uid };
  } catch (error: any) {
    console.error("Error sending custom token or authenticating phone number:", error.message);
    throw new Error("Failed to send custom token or authenticate phone number.");
  }
};


export const verifyOTP = async (uid: any, otp: string) => {
  try {
    const verifiedUser = await admin.auth().verifyIdToken(otp); 
    return verifiedUser.uid === uid;
  } catch (error) {
    console.error("Error verifying Id token:", error);
    return false;
  }
};
export const verifyIdTokenForAuth = async (req:any, res:any):Promise<void> => {
  try {
    const { uid, idToken } = req.body;
    const verifiedUser = await admin.auth().verifyIdToken(idToken); 
    if (verifiedUser.uid !== uid) {
      res.status(400).json({ status: 400, message: "Not valid token" });
      return;
    }
    res.status(200).json({ status: 200, message: "User authenticated and verifyied successfully", data: verifiedUser });
  } catch (error:any) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Invalide server error", error: error.message });
  }
};

// export const sendOTP = async (phoneNumber: string) => {
//   try {
//     const user = await admin.auth().getUserByPhoneNumber(phoneNumber);
//     if (!user) {
//       throw new Error("User with this phone number not found.");
//     }
//     // Send OTP (Firebase generates OTP for registered users)
//     const customToken = await admin.auth().createCustomToken(user.uid);
//     // Typically, the OTP is automatically sent to the user’s phone when they initiate login.
//     return customToken;
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     throw new Error("Failed to send OTP.");
//   }
// };