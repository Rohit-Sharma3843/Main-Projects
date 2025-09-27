const express = require("express");
const { commentPost } = require("../Controllers/comment");
const commentRouter = express.Router();
commentRouter.post("/:id", commentPost);
module.exports = commentRouter;
