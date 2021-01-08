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
  let token = req.headers["Bearer"];

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

isKoor = (req, res, next) => {
  Koor.findOne({
    where: {
      nim: req.nim
    }
  })
  .then(response => {
    if (response) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Koor Role!"
    })
  })
}

isAdmin = (req, res, next) => {
  Koor.findAll({
    where: {
      nim: req.nim
    },
    attributes: ['divisiID']
  })
  .then(response => {
    if (response.divisiID == 'D00') {
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
      nim: req.nim
    },
    attributes: ['divisiID']
  })
  .then(response => {
    if (response.divisiID == 'D00') {
      next();
      return;
    }

    if (response.divisiID == 'D01') {
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
  isKoor: isKoor,
  isAdmin: isAdmin,
  isAdminOrBPH: isAdminOrBPH
};
module.exports = authJwt;
