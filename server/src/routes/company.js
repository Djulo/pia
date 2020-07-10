const express = require("express");
const router = express.Router();
const companyService = require("../services/company");

// routes
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.post("/:id", updateCourier);
router.delete("/:id", _delete);

module.exports = router;

function getAll(req, res, next) {
  companyService
    .getAll()
    .then((farmers) => res.json(farmers))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  companyService
    .getById(req.user.sub)
    .then((farmer) => (farmer ? res.json(farmer) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  companyService
    .getById(req.params.id)
    .then((farmer) => (farmer ? res.json(farmer) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function updateCourier(req, res, next) {
  companyService
    .updateCourier(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  companyService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}
