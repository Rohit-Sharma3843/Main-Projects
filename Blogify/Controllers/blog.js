const blog = require("../Models/blog");
const user = require("../Models/user");
const comment = require("../Models/comment");

async function addblogGet(req, res) {
  return res.render("addblog", { user: req.user });
}

async function addblogPost(req, res) {
  try {
    if (!req.file) {
      return res.status(400).render("addblog", { 
        user: req.user, 
        error: "Please upload a cover image" 
      });
    }

    const newBlog = await blog.create({
      title: req.body.title,
      body: req.body.body,
      coverImgUrl: req.file.path, 
      createdBy: req.user._id,
    });
    
    res.redirect("/");
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).render("addblog", { 
      user: req.user, 
      error: "Error creating blog post" 
    });
  }
}

async function viewblog(req, res) {
  try {
    const b = await blog.findById(req.params.id).populate("createdBy");
    const c = await comment.find({ blogId: req.params.id }).populate("createdBy");
    
    if (!b) {
      return res.status(404).render("404", { user: req.user });
    }
    
    return res.render("viewblog", {
      blog: b,
      user: req.user,
      comments: c,
    });
  } catch (error) {
    console.error("Error viewing blog:", error);
    res.status(500).redirect("/");
  }
}

async function like(req, res) {
  try {
    const a = req.params.id;
    const uid = req.user._id;
    const b = await blog.findOne({ _id: a });
    const c = await comment.find({ blogId: req.params.id }).populate("createdBy");
    
    if (!b) {
      return res.status(404).redirect("/");
    }
    
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
  } catch (error) {
    console.error("Error liking blog:", error);
    res.redirect("/");
  }
}

module.exports = { addblogGet, addblogPost, viewblog, like };
