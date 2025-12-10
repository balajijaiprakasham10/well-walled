async function sendFeedbackEmail({ name, phone, mail, subject, message }) {
  try {
    // Determine the ADMIN email address from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    if (!adminEmail) {
      throw new Error(
        "ADMIN_EMAIL is not configured in environment variables."
      );
    }

    console.log(`Attempting to send feedback email to admin: ${adminEmail}`);
    await transporter.sendMail({
      from: `"Feedback from ${name}" <${process.env.EMAIL_USER}>`, // Set 'from' to a general mailbox
      to: adminEmail, // Send to the administrator's email
      replyTo: mail, // Allow the admin to reply directly to the user's email
      subject: `New Feedback: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #d9534f;">New Feedback Submission</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${mail}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <h3 style="color: #5cb85c;">Message:</h3>
          <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-left: 3px solid #5cb85c;">${message}</p>
        </div>
      `,
    });
    console.log(`Feedback email successfully sent to admin ${adminEmail}`);
  } catch (error) {
    console.error("Error sending feedback email:", error);
    // Log the full error object for more detail
    console.error(error);
    throw error; // Re-throw the error so the controller can handle the 500 response
  }
}
