
// import express from "express";
// import SibApiV3Sdk from "sib-api-v3-sdk";
// import dotenv from "dotenv";
// import Contact from "../models/contact.js"; // your MongoDB model

// dotenv.config();
// const router = express.Router();

// router.post("/send", async (req, res) => {
//   const { name, email, message } = req.body;

//   try {
//     // 1️⃣ Save to database
//     await Contact.create({ name, email, message });

//     // 2️⃣ Send email via Brevo
//     SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
//       process.env.BREVO_API_KEY;

//     const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

//     const sender = {
//       email: "lornanaula0042@gmail.com",
//       name: "Portfolio",
//     };

//     const receivers = [{ email: "lornanaula0042@gmail.com" }];

//     await tranEmailApi.sendTransacEmail({
//       sender,
//       to: receivers,
//       subject: `New message from ${name}`,
//       textContent: `
//         Name: ${name}
//         Email: ${email}
//         Message: ${message}
//       `,
//     });

//     res.status(200).json({ success: true, message: "Message saved & email sent!" });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ success: false, error: "Failed to send message." });
//   }
// });

// export default router;
import express from "express";
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
import Contact from "../models/Contact.js"; // MongoDB model

dotenv.config();
const router = express.Router();

router.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1️⃣ Save to database
    await Contact.create({ name, email, message });

    // 2️⃣ Send email via Brevo
    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      process.env.BREVO_API_KEY;

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = {
      email: "lornanaula0042@gmail.com",
      name: "Portfolio",
    };

    const receivers = [{ email: "lornanaula0042@gmail.com" }];

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4f46e5;">New message from your portfolio contact form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="padding: 10px; background-color: #f3f4f6; border-radius: 5px;">${message}</p>
        <hr />
        <p style="font-size: 12px; color: #888;">This message was sent via your portfolio contact form.</p>
      </div>
    `;

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: `New message from ${name}`,
      htmlContent, // ✅ Use HTML content for styled email
      textContent: `New message from ${name}\nEmail: ${email}\nMessage: ${message}`, // fallback for plain text
    });

    res.status(200).json({ success: true, message: "Message saved & email sent!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Failed to send message." });
  }
});

export default router;
