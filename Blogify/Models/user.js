const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { getToken } = require("../Services/authentication");
const connect = require("../connection");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImgUrl: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);
userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified()) {
    return;
  }
  const salt = randomBytes(16).toString();
  const hashPwd = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  user.salt = salt;
  user.password = hashPwd;
  next();
});
userSchema.static("matchPwdAndGenToken", async function (email, password) {
  await connect(process.env.MONGO_URI);
  const u = await this.findOne({ email });
  if (!u) {
    throw new Error("User not found.");
  }
  const hash = createHmac("sha256", u.salt).update(password).digest("hex");
  if (hash !== u.password) {
    throw new Error("Incorrect Password");
  }
  return getToken(u);
});
const user = mongoose.model("user", userSchema);
module.exports = user;

