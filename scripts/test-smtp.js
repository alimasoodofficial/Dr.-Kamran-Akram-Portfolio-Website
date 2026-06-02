const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

// Load the local environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

console.log("=========================================");
console.log("🔌 TESTING NODEMAILER SMTP CONNECTION");
console.log("=========================================");
console.log(`Host:     ${process.env.EMAIL_SERVER_HOST}`);
console.log(`Port:     ${process.env.EMAIL_SERVER_PORT}`);
console.log(`User:     ${process.env.EMAIL_SERVER_USER}`);
console.log(`Admin To: ${process.env.ADMIN_EMAIL}`);
console.log("=========================================");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT || "587"),
  secure: process.env.EMAIL_SERVER_PORT === "465",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

async function run() {
  try {
    console.log("🔄 Connecting to SMTP Server...");
    await transporter.verify();
    console.log("✅ SMTP Server Connection Verified Successfully!");
    
    // Now let's try sending a test diagnostic email to both the User & Admin!
    const testMailOptions = {
      from: `"${process.env.EMAIL_FROM || "Dr Muhammad Kamran"}" <${process.env.EMAIL_SERVER_USER}>`,
      to: process.env.ADMIN_EMAIL || "alimasood.work@gmail.com",
      subject: "🧪 SMTP Diagnostics Test - Successful!",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; max-width: 500px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb;">✅ Connection Successful!</h2>
          <p>This is a diagnostic email sent by your portfolio application.</p>
          <p>If you received this email, your <strong>Nodemailer SMTP transport setup</strong> is fully operational!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #777;">Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    };

    console.log(`🔄 Attempting to send diagnostic email to ${testMailOptions.to}...`);
    const info = await transporter.sendMail(testMailOptions);
    console.log("✅ Test Email Sent Successfully!");
    console.log("Message ID:", info.messageId);
    console.log("Response:", info.response);
  } catch (error) {
    console.error("❌ SMTP Diagnostics Failed with Error:");
    console.error(error);
  }
}

run();
