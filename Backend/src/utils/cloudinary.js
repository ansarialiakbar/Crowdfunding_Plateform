import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config(); // ✅ Ensure environment variables are loaded

// ✅ Debugging: Print values to check if they are being loaded
console.log("✅ Cloudinary Config Loaded in utils/cloudinary.js:");
console.log("CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME || "❌ Missing");
console.log("API_KEY:", process.env.CLOUDINARY_API_KEY || "❌ Missing");
console.log("API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌");

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Function to upload buffer to Cloudinary with proper error handling
export const cloudinaryUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    // ✅ Double-check API key before uploading
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_SECRET) {
      console.error("❌ Cloudinary API credentials are missing inside upload function!");
      return reject(new Error("Cloudinary API credentials are missing"));
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: "campaigns" },
      (error, result) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return reject(new Error("Failed to upload image to Cloudinary"));
        }
        if (!result?.secure_url) {
          return reject(new Error("Cloudinary did not return an image URL"));
        }
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
