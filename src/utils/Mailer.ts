import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const backendEmail = process.env.BACKEND_EMAIL
const appPassword = process.env.EMAIL_PASS

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: backendEmail,
    pass: appPassword,
  },
});


transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer transporter error:", error);
  } else {
    console.log("Nodemailer is ready to send emails.");
  }
});

export async function sendOnboardingEmail(memberEmail: string, generatedPassword: string) {
    const mailOptions = {
      from:`"CSEC Club Team" <${backendEmail}>`,
      to: memberEmail,
      subject: "Welcome to Our Club!",
      html: `
        <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; border-radius: 8px; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05); color: #333;">
          <div style="text-align: center;">
            <h2 style="color: #0057D9;">Welcome to the CSEC Club!</h2>
            <p style="font-size: 16px; margin-bottom: 30px;">We're thrilled to have you onboard 🎉</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #e0e0e0;">
            <p style="margin: 0 0 10px;">Here are your login details:</p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Email:</strong> <span style="color: #0057D9;">${memberEmail}</span></p>
            <p style="font-size: 16px; margin: 5px 0;"><strong>Password:</strong> <code style="background: #f0f0f0; padding: 4px 8px; border-radius: 4px; color: #d63384;">${generatedPassword}</code></p>
          </div>

          <p style="margin-top: 30px;">Please make sure to <strong>change your password</strong> immediately after your first login to keep your account secure.</p>

          <p>If you have any questions or need help, feel free to contact our team.</p>

          <p style="margin-top: 40px;">Cheers,<br/><strong>CSEC Club Team</strong></p>

          <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />

          <p style="font-size: 12px; color: #999;">If you weren't expecting this email, you can safely ignore it.</p>
        </div>
      `,

    };

    try {
      const sendEMail = await transporter.sendMail(mailOptions);
      console.log("Email sent:", sendEMail.response);
      return sendEMail.response;
    } 
    catch (error: any) {
      console.error("Email failed to send:", error.message, error);
      throw error;
    }
 
}

