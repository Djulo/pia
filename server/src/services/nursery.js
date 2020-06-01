const config = require("../config.json");
const db = require("../_helpers/db");
const ObjectId = require("mongoose").Types.ObjectId;
const Nursery = db.Nursery;
const Farmer = db.Farmer;
const Seedling = db.Seedling;

module.exports = {
  create,
  getById,
  update,
  removeSeedling,
  addSeedling,
};

async function create(params) {
  const nursery = new Nursery(params.nursery);

  // save nursery
  await nursery.save();

  // add nursery to farmer
  const farmer = await Farmer.findById(params.id);

  farmer.nurseries.push(nursery);
  await farmer.save();

  setInterval(
    async function (nursery) {
      nursery.water--;
      nursery.temperature -= 0.5;
      await nursery.save();
    },
    1000 * 60 * 60,
    nursery
  );
}

async function getById(id) {
  return await Nursery.findById(id).populate("seedlings");
}

async function update(id, nurseryParam) {
  const nursery = await Nursery.findById(id);

  // validate
  if (!nursery) throw "Nursery not found";

  // copy nurseryParam properties to nursery
  Object.assign(nursery, nurseryParam);

  await nursery.save();
}

async function removeSeedling(id, seedlingId) {
  return await Nursery.updateOne(
    { _id: id },
    {
      $pull: { seedlings: seedlingId },
    },
    { new: true },
    function (error, doc) {
      console.log("Error: " + error);
      console.log(JSON.stringify(doc));
    }
  );

  // setTimeout(
  //   async function (id, seedlingId) {
  //     await Nursery.updateOne(
  //       { _id: id },
  //       {
  //         $pull: { seedlings: seedlingId },
  //       },
  //       { new: true },
  //       function (error, doc) {
  //         console.log("Error: " + error);
  //         console.log(JSON.stringify(doc));
  //       }
  //     );
  //   },
  //   1000 * 60 * 60 * 24,
  //   id,
  //   seedlingId
  // );
}

async function addSeedling(id, seedlingId) {
  const nursery = await Nursery.findById(id);
  if (!nursery) throw "Nursery not found";

  const seedling = await Seedling.findById(seedlingId);
  if (!Seedling) throw "Seedling not found";

  nursery.seedlings.push(seedling);
  nursery.freeSpace--;

  console.log(nursery.toJSON());
  await nursery.save();
}
