// import express from "express";
// import SibApiV3Sdk from "sib-api-v3-sdk";
// import dotenv from "dotenv";

// dotenv.config();
// const router = express.Router();

// router.post("/send", async (req, res) => {
//   const { name, email, message } = req.body;

//   try {
//     SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
//       process.env.BREVO_API_KEY;

//     const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

//     const sender = {
//       email: "your_email@example.com", // must be a verified Brevo sender
//       name: name,
//     };

//     const receivers = [{ email: "your_email@example.com" }];

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

//     res.status(200).json({ success: true, message: "Email sent successfully!" });
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).json({ success: false, error: "Failed to send email." });
//   }
// });

// export default router;
import express from "express";
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
import Contact from "../models/contact.js"; // your MongoDB model

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

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: `New message from ${name}`,
      textContent: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    });

    res.status(200).json({ success: true, message: "Message saved & email sent!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, error: "Failed to send message." });
  }
});

export default router;
