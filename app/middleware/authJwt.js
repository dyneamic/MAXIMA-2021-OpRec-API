const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Koor = db.koor;

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
    if (response.divisiID === "D00") {
      next();
      return;
    }
    
    res.status(403).send({
      message: "Require SuperAdmin Role!"
    });
    return;
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
    console.log(response.divisiID);
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
};

const authJwt = {
  verifyAPIKey: verifyAPIKey,
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isAdminOrBPH: isAdminOrBPH
};
module.exports = authJwt;
