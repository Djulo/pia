const express = require("express");
const router = express.Router();
const orderService = require("../services/order");

const { Client, Status } = require("@googlemaps/google-maps-services-js");
const client = new Client("AIzaSyD0hKJB9Urho0ojkP73-c-C986LjM0lAmE");

// routes
router.post("/create", create);
router.put("/:id", update);
router.post("/delivery/:id", delivery);
router.get("/getByFarmerId/:id", getByFarmerId);

module.exports = router;

function create(req, res, next) {
  orderService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function update(req, res, next) {
  console.log(req.params.id);
  console.log(req.body);
  orderService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getByFarmerId(req, res, next) {
  orderService
    .getByFarmerId(req.params.id)
    .then((orders) => res.json(orders))
    .catch((err) => next(err));
}

function delivery(req, res, next) {
  const origin = req.body.origin;
  const destination = req.body.destination;
  const id = req.params.id;
  const companyId = req.body.companyId;
  client
    .distancematrix({
      params: {
        origins: [origin],
        destinations: [destination],
        key: "AIzaSyD0hKJB9Urho0ojkP73-c-C986LjM0lAmE",
      },
      timeout: 1000,
    })
    .then((r) => {
      if (r.data.status === Status.OK) {
        const time = r.data.rows[0].elements[0].duration.value;
        orderService
          .delivery(id, companyId, time)
          .then(() => res.json({}))
          .catch((err) => next(err));
      } else {
        next(r.data.error_message);
      }
    })
    .catch((e) => {
      next(e);
    });
}
