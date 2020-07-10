const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const Company = db.Company;

module.exports = {
  getAll,
  getById,
  updateCourier,
  delete: _delete,
};

async function getAll() {
  return await Company.find()
    .populate("items")
    .populate({
      path: "orders",
      populate: { path: "farmer" },
    })
    .populate({
      path: "orders",
      populate: { path: "nursery" },
    });
}

async function getById(id) {
  return await Company.findById(id)
    .populate("items")
    .populate({
      path: "orders",
      populate: { path: "farmer" },
    })
    .populate({
      path: "orders",
      populate: { path: "nursery" },
    });
}

async function updateCourier(id) {
  const company = await Company.findById(id);

  // validate
  if (!company) throw "User not found";

  company.courier--;
  console.log(company.courier);
  await company.save();
}

async function _delete(id) {
  await Company.findByIdAndRemove(id);
}
