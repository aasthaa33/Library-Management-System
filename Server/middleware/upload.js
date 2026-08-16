const multer = require("multer");
const path = require("path");
const fs = require("fs");

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WEBP images are allowed"), false);
  }
};

// ── Book cover upload ──────────────────────────────────────────────────────────
const bookUploadDir = path.join(__dirname, "..", "uploads", "books");
if (!fs.existsSync(bookUploadDir)) fs.mkdirSync(bookUploadDir, { recursive: true });

const bookStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, bookUploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage: bookStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Avatar upload ──────────────────────────────────────────────────────────────
const avatarUploadDir = path.join(__dirname, "..", "uploads", "avatars");
if (!fs.existsSync(avatarUploadDir)) fs.mkdirSync(avatarUploadDir, { recursive: true });

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarUploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const uploadAvatar = multer({ storage: avatarStorage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = { upload, uploadAvatar };