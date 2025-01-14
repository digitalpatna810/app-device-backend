import admin from "../config/firebase";

export const sendNotification = async (token: string, title: string, body: string) => {
    try {
      const message: any = {
        token,
        notification: {
          title: title,
          body: body,          
        },
        webpush: {
          fcm_options: {
            link: "http://localhost:5173/"
          }
        }

      }
  
      const response = await admin.messaging().send(message);
      console.log('Notification sent successfully:', response);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };
  
  