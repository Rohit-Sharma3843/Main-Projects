const { validateToken } = require("../Services/authentication");
function authCheck(cookieName) {
  return function (req, res, next) {
    const token = req.cookies[cookieName];
    if (!token) {
      return next();
    }
    try {
      const payload = validateToken(token);
      req.user = payload;
    } catch (error) {}
    return next();
  };
}
module.exports = authCheck;
