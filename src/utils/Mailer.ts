import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const backendEmail = process.env.EMAIL_USER
const pass = process.env.EMAIL_PASS

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: backendEmail,
    pass: pass,
  },
});

export async function sendOnboardingEmail(memberEmail: string, generatedPassword: string) {
  try {
    const mailOptions = {
      from: backendEmail,
      to: memberEmail,
      subject: "Welcome to Our Club!",
      html: `
        <h2>Welcome Aboard!</h2>
        <p>We're excited to have you in our club's portal.</p>
        <p><strong>Your login password:</strong> ${generatedPassword}</p>
        <p>Please keep it secure, and remember to change it upon first login.</p>
        <br />
        <p>- The Club Team</p>
      `,
    };

    const sendEMail = await transporter.sendMail(mailOptions);

    console.log("Email sent: ", sendEMail.response);
  } catch (error) {
    console.error("Failed to send onboarding email", error);
    throw error; 
  }
}

