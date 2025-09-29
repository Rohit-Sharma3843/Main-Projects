const express = require("express");
const blogRouter = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

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
