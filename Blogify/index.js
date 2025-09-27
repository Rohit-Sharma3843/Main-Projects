const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const path = require("path");
const userRouter = require("./Routes/user");
const connect = require("./connection");
const cookieParser = require("cookie-parser");
const authCheck = require("./Middlewares/authentication");
const blogRouter = require("./Routes/blog");
const blog = require("./Models/blog");
const commentRouter = require("./Routes/comment");
const uri = process.env.MONGO_URI;
app.use(express.static(path.resolve("./Public")));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
app.use(cookieParser());
app.use(authCheck("token"));
connect(uri);
app.use("/user", userRouter);
app.use("/comment", commentRouter);
app.use("/blog", blogRouter);
app.get("/", async (req, res) => {
  const b = await blog.find({});
  res.render("home", { user: req.user, blogs: b });
});
app.listen(PORT, () => {
  console.log("Server is live.");
});
module.exports = app;


