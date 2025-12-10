// server/middleware/sndMail.js
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendContactEmail = async ({
  fullName,
  email,
  phone,
  subject,
  message,
}) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL;

    if (!adminEmail) {
      throw new Error(
        "ADMIN_EMAIL is not configured in environment variables."
      );
    }
    if (!fromEmail) {
      throw new Error("FROM_EMAIL is not configured in environment variables.");
    }

    console.log(
      `Attempting to send contact email via Resend to admin: ${adminEmail}`
    );

    const { data, error } = await resend.emails.send({
      from: fromEmail, // ✅ now: "Well Walled <onboarding@resend.dev>"
      to: adminEmail,
      reply_to: email,
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

    if (error) {
      console.error("Error from Resend API:", error);
      throw new Error(error.message || "Failed to send email via Resend");
    }

    console.log(
      "✅ Contact email successfully sent via Resend:",
      data?.id || data
    );
  } catch (error) {
    console.error("Error sending contact email via Resend:", error);
    throw error;
  }
};
