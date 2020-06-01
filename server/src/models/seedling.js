const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  name: String,
  producer: String,
  progress: Number,
  position: Number,
  sproutTime: Number,
  planted: Boolean,
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Seedling", schema);
