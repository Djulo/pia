const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/error_handler");
const authorize = require("./middlewares/authorize");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use("/users", require("./routes/user"));
app.use("/farmers", authorize(["Farmer", "Admin"]), require("./routes/farmer"));
app.use(
  "/companies",
  authorize(["Company", "Admin"]),
  require("./routes/company")
);
app.use(
  "/nurseries",
  authorize(["Farmer", "Admin"]),
  require("./routes/nursery")
);
app.use("/items", require("./routes/item"));
app.use(
  "/seedlings",
  authorize(["Farmer", "Admin"]),
  require("./routes/seedling")
);
app.use("/orders", require("./routes/order"));

// global error handler
app.use(errorHandler);

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 3000;
const server = app.listen(port, function () {
  console.log("Server listening on port " + port);
});
