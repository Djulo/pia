const bcrypt = require("bcryptjs");
const ObjectId = require("mongoose").Types.ObjectId;
const db = require("../_helpers/db");
const Farmer = db.Farmer;
const Seedling = db.Seedling;
const Product = db.Product;

module.exports = {
  getAll,
  getById,
  update,
  delete: _delete,
  addNursery,
  removeProduct,
  removeSeedling,
  addSeedling,
  addProduct,
};

async function getAll() {
  return await Farmer.find()
    .populate("nurseries")
    .populate("storage.seedlings")
    .populate("storage.products");
}

async function getById(id) {
  return await Farmer.findById(id)
    .populate("nurseries")
    .populate("storage.seedlings")
    .populate("storage.products");
}

async function update(id, farmerParam) {
  const farmer = await Farmer.findById(id);

  // validate
  if (!farmer) throw "User not found";
  if (
    farmer.username !== farmer.username &&
    (await Farmer.findOne({ username: farmerParam.username }))
  ) {
    throw 'Username "' + farmerParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (farmerParam.password) {
    farmerParam.password = bcrypt.hashSync(farmerParam.password, 10);
  }

  // copy farmerParam properties to user
  Object.assign(farmer, farmerParam);

  await farmer.save();
}

async function _delete(id) {
  await Farmer.findByIdAndRemove(id);
}

async function addNursery(id, nurseryParam) {
  const farmer = await Farmer.findById(id).populate("nurseries");

  farmer.nurseries.push(nurseryParam);
  await farmer.save();

  return farmer;
}

async function removeProduct(id, productId) {
  return await Farmer.updateOne(
    { _id: id },
    {
      $pull: { "storage.products": productId },
    },
    function (error, doc) {
      console.log("Error: " + error);
      console.log(JSON.stringify(doc));
    }
  );
}

async function removeSeedling(id, seedlingId) {
  return await Farmer.updateOne(
    { _id: id },
    {
      $pull: { "storage.seedlings": seedlingId },
    },
    function (error, doc) {
      console.log("Error: " + error);
      console.log(JSON.stringify(doc));
    }
  );
}

async function addSeedling(id, seedlingParams) {
  const seedling = new Seedling(seedlingParams);

  // save seedling
  await seedling.save();

  // add seedling to the farmer storage
  const farmer = await Farmer.findById(id);

  farmer.storage.seedlings.push(seedling);
  await farmer.save();
}

async function addProduct(id, productParams) {
  const product = new Product(productParams);

  // save product
  await product.save();

  // add product to the farmer storage
  const farmer = await Farmer.findById(id);

  farmer.storage.products.push(product);
  await farmer.save();
}
