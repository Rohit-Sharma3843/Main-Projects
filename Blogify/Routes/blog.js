const express = require("express");
const blogRouter = express.Router();
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blogify-uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto' }
    ],
    public_id: (req, file) => {
      return `blog-${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    },
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const {
  addblogGet,
  addblogPost,
  viewblog,
  like,
} = require("../Controllers/blog");

blogRouter.get("/addblog", addblogGet);
blogRouter.post("/addblog", upload.single("coverImg"), addblogPost);
blogRouter.get("/:id", viewblog);
blogRouter.get("/like/:id", like);

module.exports = blogRouter;
