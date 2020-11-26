const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "MXM 21 Oprec Server Is Up and Running" });
});

//start db
/*
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

function initial() {
  const Status = db.status;
  const Technical = db.technical;

  Status.create({
    statusID: 1,
    name: "Registered"
  });
 
  Status.create({
    statusID: 2,
    name: "Reviewed for Interview"
  });

  Status.create({
    statusID: 3,
    name: "Called for Interview"
  });

  Status.create({
    statusID: 4,
    name: "Shortlisted for Acceptance"
  });

  Status.create({
    statusID: 5,
    name: "Accepted"
  });

  Technical.create({
    id: 1,
    message: "Database is up and running."
  });
}
*/

db.sequelize.sync();

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});