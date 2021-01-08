const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./app/models");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

//app.use(cors(corsOptions));
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// start route
app.get("/", (req, res) => {
  //res.json({ message: "MXM 21 Oprec Server Is Up and Running" });
  res.sendFile(__dirname + '/pages/welcome.html');
});
app.use(express.static('pages'));

//start db
/*
db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Db');
  initial();
});

function initial() {
  const Status = db.status;
  const Technical = db.technical;
  const Divisi = db.divisi;

  //status
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

  //end of status
  //divisi

  Divisi.create({
    divisiID: "D00",
    name: "SuperAdmin"
  });
  
  Divisi.create({
    divisiID: "D01",
    name: "BPH"
  });

  Divisi.create({
    divisiID: "D02",
    name: "Acara"
  });

  Divisi.create({
    divisiID: "D03",
    name: "Bazaar"
  });

  Divisi.create({
    divisiID: "D04",
    name: "Dekorasi"
  });

  Divisi.create({
    divisiID: "D05",
    name: "Dokumentasi - Foto"
  });

  Divisi.create({
    divisiID: "D06",
    name: "Dokumentasi - Video"
  });

  Divisi.create({
    divisiID: "D07",
    name: "Fresh Money"
  });

  Divisi.create({
    divisiID: "D08",
    name: "IT"
  });

  Divisi.create({
    divisiID: "D09",
    name: "Keamanan"
  });

  Divisi.create({
    divisiID: "D10",
    name: "Media Relations"
  });

  Divisi.create({
    divisiID: "D11",
    name: "Merchandise"
  });

  Divisi.create({
    divisiID: "D12",
    name: "Perlengkapan"
  });

  Divisi.create({
    divisiID: "D13",
    name: "Public Relations - Publikasi"
  });

  Divisi.create({
    divisiID: "D14",
    name: "Public Relations - Visual"
  });

  Divisi.create({
    divisiID: "D15",
    name: "Security and Accomodations"
  });

  Divisi.create({
    divisiID: "D16",
    name: "Sponsor"
  });
  //end of divisi

  Technical.create({
    id: 1,
    message: "Database is up and running."
  });
}
*/

db.sequelize.sync();

//routing

//mahasiswa
require('./app/routes/mahasiswa/mahasiswa.routes')(app);

//koor
require('./app/routes/koor/koor.routes')(app);

//technical
require('./app/routes/technical/technical.routes')(app);

//end of routing

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});