const user = require("../Models/user");
function signinGet(req, res) {
  return res.render("signin");
}
function signupGet(req, res) {
  return res.render("signup");
}
async function signupPost(req, res) {
  const u = await user.create({
    fullName: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  return res.render("signin");
}
async function signinPost(req, res) {
  const mail = req.body.email;
  const pwd = req.body.password;
  try {
    const token = await user.matchPwdAndGenToken(mail, pwd);
    res.cookie("token", token, {
  httpOnly: true, 
  secure: true,        
  sameSite: "Lax",      
  maxAge: 24 * 60 * 60 * 1000,
  path: "/"
});
    return res.redirect("/");
  } catch (error) {
    return res.render("signin", { error: "Invalid user credentials." });
  }
}
async function logout(req, res) {
  res.clearCookie("token");
  res.redirect("/user/signin");
}
module.exports = { signinGet, signupGet, signupPost, signinPost, logout };


