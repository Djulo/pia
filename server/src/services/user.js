const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../_helpers/db");
const User = db.User;
const Farmer = db.Farmer;
const Company = db.Company;

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  createAdmin,
  changePassword,
};

async function authenticate({ username, password }) {
  const user = await User.findOne({ username });
  if (user && !user.active) {
    throw "User has not been approved by administrator";
  }
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ sub: user.id, id: user.id }, config.secret);
    return {
      ...user.toJSON(),
      token,
    };
  }
}

async function getAll() {
  return await User.find();
}

async function getById(id) {
  return await User.findById(id);
}

async function create(userParam) {
  // validate
  if (await User.findOne({ username: userParam.username })) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  console.log(userParam);
  var user;
  if (userParam.role == "Farmer") user = new Farmer(userParam);
  else if (userParam.role == "Company") user = new Company(userParam);
  else if (userParam.role == "Admin") {
    user = new User(userParam);
    user.active = true;
  }

  // hash password
  if (userParam.password) {
    user.password = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}

async function update(id, userParam) {
  const user = await User.findById(id);

  // validate
  if (!user) throw "User not found";
  if (
    user.username !== userParam.username &&
    (await User.findOne({ username: userParam.username }))
  ) {
    throw 'Username "' + userParam.username + '" is already taken';
  }

  // hash password if it was entered
  if (userParam.password) {
    userParam.password = bcrypt.hashSync(userParam.password, 10);
  }

  // copy userParam properties to user
  Object.assign(user, userParam);

  await user.save();
}

async function changePassword(id, oldPassword, password) {
  const user = await User.findById(id);

  if (!user) throw "User not found";
  if (bcrypt.compareSync(oldPassword, user.password)) {
    if (bcrypt.compareSync(password, user.password)) {
      throw "Nova sifra se mora razlikovati od stare";
    }

    user.password = bcrypt.hashSync(password, 10);
  } else {
    throw "Pogresna sifra";
  }

  await user.save();
}

async function _delete(id) {
  await User.findByIdAndRemove(id);
}

async function createAdmin() {
  const userParam = {
    username: "admin",
    role: "Admin",
    active: true,
    password: "password",
    email: "admin@admin.com",
  };
  const user = new User(userParam);

  // hash password
  if (userParam.password) {
    user.password = bcrypt.hashSync(userParam.password, 10);
  }

  // save user
  await user.save();
}
