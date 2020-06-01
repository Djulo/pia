const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  items: { type: Array },
  price: Number,
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Farmer",
  },
  nursery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nursery",
  },
  date: Date,
  confirmed: Boolean,
  status: String,
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Order", schema);
