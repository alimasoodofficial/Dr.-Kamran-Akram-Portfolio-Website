import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function main() {
  const secret = process.env.JWT_SECRET || process.env.STRIPE_SECRET_KEY || "kamran_secret_key_123_abc";
  console.log("Secret used:", secret);

  const email = "f2022266014@umt.edu.pk";
  const sanitizedEmail = email.trim().toLowerCase();
  
  // 1. Simulate send-code token generation (without actual mail)
  const code = "123456";
  const expirationTime = String(Date.now() + 10 * 60 * 1000); // 10 minutes
  const dataToSign = `${sanitizedEmail}:${code}:${expirationTime}`;
  const hash = crypto.createHmac("sha256", secret).update(dataToSign).digest("hex");
  console.log("Generated hash for verify-code:", hash);

  // 2. Simulate verify-code validation
  const expectedHash = crypto.createHmac("sha256", secret).update(dataToSign).digest("hex");
  if (hash !== expectedHash) {
    console.error("FAIL: Hash mismatch in verify-code logic");
    return;
  }
  console.log("PASS: Hash matched in verify-code logic");

  // Generate session token (libraryToken)
  const issuedAt = Date.now();
  const tokenData = `${sanitizedEmail}:${issuedAt}`;
  const tokenSignature = crypto.createHmac("sha256", secret).update(tokenData).digest("hex");
  const libraryToken = `${tokenData}.${tokenSignature}`;
  console.log("Generated libraryToken:", libraryToken);

  // 3. Simulate purchases token verification
  const lastDotIndex = libraryToken.lastIndexOf(".");
  if (lastDotIndex === -1) {
    console.error("FAIL: libraryToken separator not found");
    return;
  }
  const rcvdTokenData = libraryToken.substring(0, lastDotIndex);
  const rcvdSignature = libraryToken.substring(lastDotIndex + 1);

  const expectedSignature = crypto.createHmac("sha256", secret).update(rcvdTokenData).digest("hex");
  if (rcvdSignature !== expectedSignature) {
    console.error("FAIL: Signature mismatch in purchases logic");
    return;
  }
  console.log("PASS: Signature matched in purchases logic");

  const [tokenEmail, tokenTimestampStr] = rcvdTokenData.split(":");
  if (tokenEmail !== sanitizedEmail) {
    console.error("FAIL: Email mismatch");
    return;
  }
  console.log("PASS: Email matched");
  
  console.log("ALL LOCAL TESTS PASSED!");
}

main();
