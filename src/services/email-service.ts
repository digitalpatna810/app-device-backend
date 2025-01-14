import transporter from "../config/nodemailer";

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
  const verificationUrl = process.env.VERIFICATION_URL;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text: `Click on this link to verify your email: ${verificationUrl}`,
    html: `<p>Click on this <a href="${verificationUrl}">link</a> to verify your email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully.");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
  }

};
export const sendEmail = async (email: string, subject: string, text: string) => {
  try {
      const info = await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject,
          text,
      });

      console.log('Email sent:', info.messageId);
  } catch (error) {
      console.error('Failed to send email:', error);
  }
};
