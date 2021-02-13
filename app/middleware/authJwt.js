const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Koor = db.koor;
const Technical = db.technical;
const techControl = require("../controllers/technical/technical.controller");

verifyAPIKey = (req, res, next) => {
  let key = req.headers["x-api-key"];
  
  if (!key) {
    return res.status(401).send({ 
      message: "No API key provided! Please contact MAXIMA 2021 WebMaster for further assistance."
    })
  }

  if (key === config.APIKey) {
    next();
  }
  else {
    return res.status(401).send({ 
      message: "Invalid API key! Please contact MAXIMA 2021 WebMaster for further assistance."
    })
  }
}

verifyToken = (req, res, next) => {
  let token = req.headers["bearer"];

  if (!token) {
    return res.status(401).send({
      message: "No token provided!"
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Invalid or expired token. Please login again."
      });
    }
    req.nim = decoded.nim; //nim awalny userId
    next();
  });
};

isAdmin = (req, res, next) => {
  Koor.findAll({
    where: {
      nim_koor: req.body.nim_koor
    },
    attributes: ['divisiID']
  })
  .then(response => {
    response = response[0];
    if (response.divisiID === "D00") {
      next();
      return;
    }
    
    res.status(403).send({
      message: "Require SuperAdmin Role!"
    });
    return;
  })
  .catch(err => {
    kode_error = 310300;
    techControl.addErrorLog(kode_error, "Middleware", "JWT", "isAdmin", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
};

isAdminOrBPH = (req, res, next) => {
  Koor.findAll({
    where: {
      nim_koor: req.body.nim_koor
    },
    attributes: ['divisiID']
  })
  .then(response => {
    response = response[0];
    if (response.divisiID === 'D00') {
      console.log('response1');
      next();
      return;
    }

    if (response.divisiID === 'D01') {
      console.log('response2');
      next();
      return;
    }

    res.status(403).send({
      message: "Require SuperAdmin or BPH Role!"
    });
    return;
  })
  .catch(err => {
    kode_error = 310400;
    techControl.addErrorLog(kode_error, "Middleware", "JWT", "isAdminOrBPH", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
};

isOprecMhsOpen = (req, res, next) => {
  Technical.findAll({
    where: {
      id: 3
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    if (response.value_message === 'true') {
      next();
    }
    else {
      return res.status(503).send({ message: "Pendaftaran oprec telah ditutup! "});
    }
  })
  .catch(err => {
    kode_error = 310500;
    techControl.addErrorLog(kode_error, "Middleware", "JWT", "isOprecMhsOpen", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

isKoorUpdateOpen = (req, res, next) => {
  Technical.findAll({
    where: {
      id: 4
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    if (response.value_message === 'true') {
      next();
    }
    else {
      return res.status(503).send({ message: "Update data telah ditutup! "});
    }
  })
  .catch(err => {
    kode_error = 310600;
    techControl.addErrorLog(kode_error, "Middleware", "JWT", "isKoorUpdateOpen", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

isZoomOpen = (req,res,next) => {
  Technical.findAll({
    where: {
      id: 5
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    if (response.value_message === 'true') {
      next();
    }
    else {
      return res.status(503).send({ message: "Link Zoom belum dibuka!"});
    }
  })
  .catch(err => {
    kode_error = 310700;
    techControl.addErrorLog(kode_error, "Middleware", "JWT", "isZoomOpen", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

isMahasiswaCheckOpen = (req,res,next) => {
  Technical.findAll({
    where: {
      id: 6
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    if (response.value_message === 'true') {
      next();
    }
    else {
      return res.status(503).send({ message: "Hasil seleksi formulir belum dibuka!"});
    }
  })
  .catch(err => {
    kode_error = 310900;
    techControl.addErrorLog(kode_error, "Middleware", "JWT", "isMahasiswaCheckOpen", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

isLulusInterviewOpen = (req,res,next) => {
  Technical.findAll({
    where: {
      id: 7
    },
    attributes: ['value_message']
  })
  .then((response) => {
    response = response[0];
    if (response.value_message === 'true') {
      next();
    }
    else {
      return res.status(503).send({ message: "Update lulus interview belum dibuka!"});
    }
  })
  .catch(err => {
    kode_error = 311000;
    techControl.addErrorLog(kode_error, "Middleware", "JWT", "isLulusInterviewOpen", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

const authJwt = {
  verifyAPIKey: verifyAPIKey,
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isAdminOrBPH: isAdminOrBPH,
  //toggle
  isOprecMhsOpen: isOprecMhsOpen,
  isKoorUpdateOpen: isKoorUpdateOpen,
  isZoomOpen: isZoomOpen,
  isMahasiswaCheckOpen: isMahasiswaCheckOpen,
  isLulusInterviewOpen: isLulusInterviewOpen
};
module.exports = authJwt;
