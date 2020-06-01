const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");

const Farmer = User.discriminator(
  "Farmer",
  new mongoose.Schema({
    firstName: String,
    lastName: String,
    nurseries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Nursery",
      },
    ],

    storage: {
      products: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      seedlings: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Seedling",
        },
      ],
    },
  })
);

module.exports = mongoose.model("Farmer");
