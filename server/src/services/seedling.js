const db = require("../_helpers/db");
const Seedling = db.Seedling;
const Nursery = db.Nursery;

module.exports = {
  create,
  getById,
  update,
  delete: _delete,
};

async function create(nurseryId, seedlingParams) {
  const seedling = new Seedling(seedlingParams);

  // save seedling
  await seedling.save();

  // add seedling to the nursery
  const nursery = await Nursery.findById(nurseryId);

  nursery.seedlings.push(seedling);
  await nursery.save();
}

async function getById(id) {
  return await Seedling.findById(id);
}

async function update(id, seedlingParam) {
  const seedling = await Seedling.findById(id);

  // validate
  if (!seedling) throw "Seedling not found";

  // copy seedlingParam properties to seedling
  Object.assign(seedling, seedlingParam);

  console.log(seedling.toJSON());

  await seedling.save();
}

async function _delete(id) {
  await Seedling.findByIdAndRemove(id);
}
