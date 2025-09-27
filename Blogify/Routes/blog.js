const express = require("express");
const blogRouter = express.Router();
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
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
