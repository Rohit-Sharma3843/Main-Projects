const express = require("express");
const userRouter = express.Router();
const {
  signinGet,
  signupGet,
  signupPost,
  signinPost,
  logout,
} = require("../Controllers/user");
userRouter.get("/signin", signinGet);
userRouter.get("/signup", signupGet);
userRouter.post("/signup", signupPost);
userRouter.post("/signin", signinPost);
userRouter.get("/logout", logout);
module.exports = userRouter;
