const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
  name: String,
  location: String,
  freeSpace: Number,
  water: Number,
  temperature: Number,
  width: Number,
  height: Number,

  seedlings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seedling",
    },
  ],
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Nursery", schema, "nurseries");
