const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  type: String,
  name: String,
  producer: String,
  quantity: Number,
  price: Number,
  sproutTime: Number,
  advanceTime: Number,
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Item", schema);
