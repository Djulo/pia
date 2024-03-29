const config = require("../config.json");
const mongoose = require("mongoose");
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.connect(
  process.env.MONGODB_URI || config.connectionString,
  connectionOptions
);
mongoose.Promise = global.Promise;

module.exports = {
  User: require("../models/user"),
  Farmer: require("../models/farmer"),
  Company: require("../models/company"),
  Nursery: require("../models/nursery"),
  Seedling: require("../models/seedling"),
  Item: require("../models/item"),
  Product: require("../models/product"),
  Order: require("../models/order"),
  isValidId,
};

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}
