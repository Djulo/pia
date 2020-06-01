const express = require("express");
const router = express.Router();
const seedlingService = require("../services/seedling");

// routes
router.post("/create", create);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", _delete);

module.exports = router;

function create(req, res, next) {
  console.log(req.body);
  seedlingService
    .create(req.body.id, req.body.seedling)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  seedlingService
    .getById(req.params.id)
    .then((seedling) => (seedling ? res.json(seedling) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  seedlingService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  seedlingService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
