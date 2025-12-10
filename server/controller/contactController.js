import { ContactCollection } from "../models/contact.js";
import { sendContactEmail } from "../middleware/sndMail.js";

export const submitContactForm = async (req, res) => {
  try {
    console.log("📩 Contact form request body:", req.body);

    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, and message are required.",
      });
    }

    // ✅ Store in DB
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

    // ✅ Send Email
    await sendContactEmail({ fullName, email, phone, subject, message });

    return res.status(200).json({
      success: true,
      message: "Thank you for reaching out! We'll get back to you soon.",
    });
  } catch (error) {
    console.error("💥 Error in submitContactForm:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Something went wrong while submitting the form.",
    });
  }
};
