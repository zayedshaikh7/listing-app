const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOULD_NAME,
    api_key: process.env.CLOULD_API_KEY,
    api_secret: process.env.CLOULD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "uploads",
    allowedFormats: ["jpg", "png", "jpeg"]
});

module.exports = { cloudinary, storage };