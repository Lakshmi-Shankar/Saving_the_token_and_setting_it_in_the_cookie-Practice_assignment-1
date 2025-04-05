const crypto = require("crypto");
const jwt = require("jsonwebtoken");


payload = { id: 1, userName: "Lakshmi Shankar" }
const SK = "manHole";

// You should persist these in env in real apps
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const encrypt = (payload) => {
  // Step 1: Sign the payload
  const token = jwt.sign(payload, SK, { expiresIn: "1h" });

  // Step 2: Encrypt the JWT
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Step 3: Return `iv:encrypted`
  const result = iv.toString("hex") + ":" + encrypted;
  console.log("Encrypted:", result);
  return result;
};

const decrypt = (token) => {
  // Step 1: Split IV and encrypted data
  const [ivHex, encrypted] = token.split(":");
  const iv = Buffer.from(ivHex, "hex");

  // Step 2: Decrypt AES
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  // Step 3: Verify and decode JWT
  const payload = jwt.verify(decrypted, SK);
  console.log("Decrypted Payload:", payload);
  return payload;
};

// Test
const token = encrypt(payload);
decrypt(token);

module.exports = { encrypt, decrypt };
