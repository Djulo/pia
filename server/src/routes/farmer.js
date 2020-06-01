const express = require("express");
const router = express.Router();
const farmerService = require("../services/farmer");

// routes
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);
router.post("/removeProduct/:id", removeProduct);
router.post("/removeSeedling/:id", removeSeedling);
router.post("/addSeedling/:id", addSeedling);
router.post("/addProduct/:id", addProduct);

module.exports = router;

function getAll(req, res, next) {
  farmerService
    .getAll()
    .then((farmers) => res.json(farmers))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  farmerService
    .getById(req.user.sub)
    .then((farmer) => (farmer ? res.json(farmer) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  farmerService
    .getById(req.params.id)
    .then((farmer) => (farmer ? res.json(farmer) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  farmerService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  farmerService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function addProduct(req, res, next) {
  console.log(req.body.product);
  farmerService
    .addProduct(req.params.id, req.body.product)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function removeProduct(req, res, next) {
  farmerService
    .removeProduct(req.params.id, req.body.productId)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function removeSeedling(req, res, next) {
  farmerService
    .removeSeedling(req.params.id, req.body.seedlingId)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function addSeedling(req, res, next) {
  farmerService
    .addSeedling(req.params.id, req.body.seedling)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
