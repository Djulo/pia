const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const Company = db.Company;

module.exports = {
  getAll,
  getById,
  update,
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

async function update(id, companyParams) {
  const company = await Company.findById(id);

  // validate
  if (!company) throw "User not found";
  if (
    company.username !== company.username &&
    (await Company.findOne({
      username: companyParams.username,
    }))
  ) {
    throw 'Username "' + companyParams.username + '" is already taken';
  }

  // hash password if it was entered
  if (companyParams.password) {
    companyParams.password = bcrypt.hashSync(companyParams.password, 10);
  }

  // copy companyParams properties to user
  Object.assign(company, companyParams);

  await company.save();
}

async function _delete(id) {
  await Company.findByIdAndRemove(id);
}
