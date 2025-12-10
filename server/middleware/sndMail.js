// server/middleware/sndMail.js
import nodemailer from "nodemailer";

// create transporter (adjust to your env vars)
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // usually false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send contact email to admin
 */
export const sendContactEmail = async ({
  fullName,
  email,
  phone,
  subject,
  message,
}) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    if (!adminEmail) {
      throw new Error(
        "ADMIN_EMAIL is not configured in environment variables."
      );
    }

    console.log(`Attempting to send contact email to admin: ${adminEmail}`);

    await transporter.sendMail({
      from: `"Contact Form - ${fullName}" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      replyTo: email, // admin can reply directly to user
      subject: `New Contact: ${subject || "No subject"}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #007bff;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <h3>Message:</h3>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 3px solid #007bff;">
            ${message}
          </p>
        </div>
      `,
    });

    console.log(`Contact email successfully sent to admin ${adminEmail}`);
  } catch (error) {
    console.error("Error sending contact email:", error);
    throw error;
  }
};
