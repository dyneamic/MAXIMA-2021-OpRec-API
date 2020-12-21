const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Koor = db.koor;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
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
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isAdminOrBPH: isAdminOrBPH
};
module.exports = authJwt;
