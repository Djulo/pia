const express = require("express");
const router = express.Router();
const nurseryService = require("../services/nursery");

// routes
router.post("/create", create);
router.get("/:id", getById);
router.put("/:id", update);
router.patch("/removeSeedling/:id", removeSeedling);
router.post("/addSeedling/:id", addSeedling);

module.exports = router;

function create(req, res, next) {
  console.log(req.body);
  nurseryService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  nurseryService
    .getById(req.params.id)
    .then((nursery) => (nursery ? res.json(nursery) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  nurseryService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function removeSeedling(req, res, next) {
  nurseryService
    .removeSeedling(req.params.id, req.body.seedlingId)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function addSeedling(req, res, next) {
  nurseryService
    .addSeedling(req.params.id, req.body.seedlingId)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
