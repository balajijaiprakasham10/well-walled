import { ContactCollection } from "../models/contact.js";
import { sendContactEmail } from "../middleware/sndMail.js";

export const submitContactForm = async (req, res) => {
  try {
    console.log("📩 Contact form request body:", req.body);

    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !message) {
      console.log("❌ Validation failed for contact form");
      return res.status(400).json({
        success: false,
        message: "Full name, email, and message are required.",
      });
    }

    // 1. Save in DB
    console.log("🗄 Saving contact form in database...");
    const result = await ContactCollection.insertOne({
      fullName,
      email,
      phone,
      subject,
      message,
      isRead: false,
      createdAt: new Date(),
    });

    console.log("✅ Contact saved in DB with ID:", result.insertedId);

    // 2. Try sending email, but don't fail the whole request if this breaks
    try {
      console.log("✅ Validation passed, calling sendContactEmail...");
      await sendContactEmail({
        fullName,
        email,
        phone,
        subject,
        message,
      });
      console.log("✅ sendContactEmail completed without throwing");
    } catch (emailError) {
      console.error("📧 Email sending failed (but contact saved):", emailError);
      // you could also store this info in DB/logging service if needed
    }

    // 3. Always respond success to the user (since DB is ok)
    return res.status(200).json({
      success: true,
      message: "Thank you for reaching out! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("💥 Error in submitContactForm:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while submitting the contact form.",
    });
  }
};
