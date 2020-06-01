const db = require("../_helpers/db");
const Item = db.Item;
const Company = db.Company;

module.exports = {
  create,
  getById,
  update,
  delete: _delete,
  getAll,
};

async function create(params) {
  const item = new Item(params.item);

  // save item
  await item.save();

  // add item to the company
  const company = await Company.findById(params.id);

  company.items.push(item);
  await company.save();
}

async function getAll() {
  return await Item.find();
}

async function getById(id) {
  return await Item.findById(id);
}

async function update(id, itemParam) {
  const item = await Item.findById(id);

  // validate
  if (!item) throw "Item not found";

  Object.assign(item, itemParam);

  await item.save();
}

async function _delete(id) {
  await Item.findByIdAndRemove(id);
}
