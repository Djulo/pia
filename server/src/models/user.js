const Role = require("../_helpers/role");
const mongoose = require("mongoose");

const options = { discriminatorKey: "role" };

const User = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, required: true, index: true },

    password: String,

    role: { type: Role },
    active: { type: Boolean, default: false },
  },
  options
);

User.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.password;
  },
});

module.exports = mongoose.model("User", User);
