const express = require("express");
const router = express.Router();
const userService = require("../services/user");
const authorize = require("../middlewares/authorize");
const Role = require("../_helpers/role");
const request = require("request");
const Recaptcha = require("express-recaptcha").RecaptchaV2;

// routes
router.post("/authenticate", authenticate);
router.post("/register", register);
router.get("/", getAll);
router.get("/current", getCurrent);
router.get("/:id", getById);
router.put("/:id", update);
router.post("/:id/changePassword", changePassword);
router.delete("/:id", _delete);
router.post("/token_validate", token_validate);
router.post("/admin/register", adminRegister);

module.exports = router;

function authenticate(req, res, next) {
  console.log(req.body);
  userService
    .authenticate(req.body)
    .then((user) =>
      user
        ? res.json(user)
        : res.status(400).json({ message: "Username or password is incorrect" })
    )
    .catch((err) => next(err));
}

function register(req, res, next) {
  userService
    .create(req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function getAll(req, res, next) {
  userService
    .getAll()
    .then((users) => res.json(users))
    .catch((err) => next(err));
}

function getCurrent(req, res, next) {
  userService
    .getById(req.user.sub)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function getById(req, res, next) {
  userService
    .getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch((err) => next(err));
}

function update(req, res, next) {
  userService
    .update(req.params.id, req.body)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function changePassword(req, res, next) {
  userService
    .changePassword(req.params.id, req.body.oldPassword, req.body.password)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function _delete(req, res, next) {
  userService
    .delete(req.params.id)
    .then(() => res.json({}))
    .catch((err) => next(err));
}

function token_validate(req, res) {
  let token = req.body.recaptcha;
  const secretKey = "6LeuTvYUAAAAAHFRMXaDs8flrxgtEHKmh8EGkiur"; //the secret key from your google admin console;

  //token validation url is URL: https://www.google.com/recaptcha/api/siteverify
  // METHOD used is: POST

  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  //note that remoteip is the users ip address and it is optional
  // in node req.connection.remoteAddress gives the users ip address

  if (token === null || token === undefined) {
    res
      .status(201)
      .send({ success: false, message: "Token is empty or invalid" });
    return console.log("token empty");
  }

  request(url, function (err, resp, body) {
    body = JSON.parse(body);

    //check if the validation failed
    if (body.success !== undefined && !body.success) {
      res.send({ success: false, message: "Captcha validation failed" });
      return console.log("failed");
    }

    //if passed response success message to client
    console.log("passed");
    res.send({ success: true, message: "Captcha validatoin passed" });
  });
}

function adminRegister(req, res, next) {
  userService
    .createAdmin()
    .then(() => res.json({}))
    .catch((err) => next(err));
}
