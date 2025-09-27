const comment = require("../Models/comment");
async function commentPost(req, res) {
  await comment.create({
    content: req.body.content,
    blogId: req.params.id,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.id}`);
}
module.exports = { commentPost };
