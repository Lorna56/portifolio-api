// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import SibApiV3Sdk from "sib-api-v3-sdk";
// import mailRoutes from "./routes/mail.js";

// dotenv.config();
// const app = express();
// app.use(cors());
// app.use(express.json());
// app.use("/api/mail", mailRoutes);

// app.post("/send-email", async (req, res) => {
//   const { name, email, message } = req.body;

//   const client = SibApiV3Sdk.ApiClient.instance;
//   const apiKey = client.authentications["api-key"];
//   apiKey.apiKey = process.env.BREVO_API_KEY;

//   const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

//   const sender = { email: "your_verified_email@domain.com", name: "Portfolio" };
//   const receivers = [{ email: "your_personal_email@gmail.com" }];

//   try {
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

//     res.status(200).json({ success: true, message: "Email sent successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to send email" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";
import mongoose from "mongoose";
import mailRoutes from "./routes/mail.js";
import Contact from "./models/Contact.js"; // Your Contact model

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/mail", mailRoutes);

// -------------------------
// Connect to MongoDB
// -------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

// -------------------------
// Send email + save to DB
// -------------------------
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  const client = SibApiV3Sdk.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

  const sender = { email: "your_verified_email@domain.com", name: "Portfolio" };
  const receivers = [{ email: "your_personal_email@gmail.com" }];

  try {
    // Save message to DB
    await Contact.create({ name, email, message });

    // Send email via Brevo
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

    res.status(200).json({ success: true, message: "Email sent and saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send email or save message" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
