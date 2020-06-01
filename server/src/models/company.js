const mongoose = require("mongoose");
const User = require("./user");

const Company = User.discriminator(
  "Company",
  new mongoose.Schema({
    location: String,
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    courier: {
      type: Number,
      default: 5,
    },
  })
);

module.exports = mongoose.model("Company");
