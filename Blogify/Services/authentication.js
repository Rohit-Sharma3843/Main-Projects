const jwt = require("jsonwebtoken");
const secret = "11da1000";
function getToken(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImgUrl: user.profileImgUrl,
    role: user.role,
    name: user.fullName,
  };
  const token = jwt.sign(payload, secret);
  return token;
}
function validateToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}
module.exports = { getToken, validateToken };
