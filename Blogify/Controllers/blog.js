const blog = require("../Models/blog");
const user = require("../Models/user");
const comment = require("../Models/comment");
async function addblogGet(req, res) {
  return res.render("addblog", { user: req.user });
}
async function addblogPost(req, res) {
  const a = await blog.create({
    title: req.body.title,
    body: req.body.body,
    coverImgUrl: req.file.path,
    createdBy: req.user._id,
  });
  res.redirect("/");
}
async function viewblog(req, res) {
  const b = await blog.findById(req.params.id).populate("createdBy");
  const c = await comment.find({ blogId: req.params.id }).populate("createdBy");
  return res.render("viewblog", {
    blog: b,
    user: req.user,
    comments: c,
  });
}
async function like(req, res) {
  const a = req.params.id;
  const uid = req.user._id;
  const b = await blog.findOne({ _id: a });
  const c = await comment.find({ blogId: req.params.id }).populate("createdBy");
  if (b.likes.includes(uid.toString())) {
    b.likes.pull(uid);
  } else {
    b.likes.push(uid);
  }
  await b.save();
  return res.render("viewblog", {
    blog: b,
    user: req.user,
    comments: c,
  });
}
module.exports = { addblogGet, addblogPost, viewblog, like };
