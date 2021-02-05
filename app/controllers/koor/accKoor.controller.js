const db = require("../../models");
const config = require("../../config/auth.config");
const Koor = db.koor;
const PassResetKoor = db.passwordResetKoor;
const KoorLoginLog = db.koorLoginLog;
const techControl = require("../technical/technical.controller");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

function getIP(req) {
  let ip = req.headers['x-forwarded-for'];
  if (ip) return ip;
  else return "unknown";
}

function generateOTP() {
  let randomOTP = '';
  let characters = '0123456789';
  let charactersLength = 6;
  for ( var i = 0; i < 6; i++ ) {
    randomOTP += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return randomOTP;
}

exports.signUp = (req, res) => {
  const { nim_koor, name, divisiID } = req.body;
  Koor.count({
    where: {
      nim_koor: nim_koor
    }
  })
  .then(counts => {
    if (counts >= 1) {
      res.status(403).send({ message: "Sudah pernah mendaftar sebelumnya!"});
    }
    else {
      Koor.create({
        nim_koor: nim_koor,
        name: name,
        password: null,
        divisiID: divisiID
      })
      .then(() => {
        PassResetKoor.create({
          nim_koor: nim_koor,
          otp: generateOTP(),
          expired: 0
        })
        res.status(200).send({ message: "Berhasil mendaftar! "});
      })
      .catch(err => {
        kode_error = 120101;
        techControl.addErrorLog(kode_error, "Controller", "Account Koor", "Sign Up", err.message);
        res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
      });
    }
  })
  .catch(err => {
    kode_error = 120100;
    techControl.addErrorLog(kode_error, "Controller", "Account Koor", "Sign Up", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  });
}

exports.signIn = (req,res) => {
  const { nim_koor, password } = req.body;
  if (!password) {
    return res.status(403).send({ message: "Please enter password." });
  }
  Koor.findOne({
    where: { nim_koor: nim_koor}
  })
  .then(koor => {
    if (!koor) {
      return res.status(403).send({ message: "User Not found." });
    }

    if (koor.password === null) {
      return res.status(403).send({ message: "Akun belum ada password." });
    }
    
    let passwordIsValid = bcrypt.compareSync(
      password,
      koor.password
    );

    if (!passwordIsValid) {
      return KoorLoginLog.create({
        nim_koor: nim_koor,
        ip_address: getIP(req),
        result: "Invalid Password"
      })
      .then(() => {
        res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      })
      .catch(err => {
        kode_error = 120202;
        techControl.addErrorLog(kode_error, "Controller", "Account Koor", "Sign In", err.message);
        res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
      })     
    }

    let token = jwt.sign({ nim_koor: koor.nim_koor, divisiID: koor.divisiID }, config.secret, {
      expiresIn: 3600 // 1 hour
    });

    KoorLoginLog.create({
      nim_koor: nim_koor,
      ip_address: getIP(req),
      result: "Successful Login"
    })
    .then(() => {
      res.status(200).send({
        accessToken: token,
        name: koor.name
      })
    })
    .catch(err => {
      kode_error = 120201;
      techControl.addErrorLog(kode_error, "Controller", "Account Koor", "Sign In", err.message);
      res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
    })    
  })
  .catch(err => {
    kode_error = 120200;
    techControl.addErrorLog(kode_error, "Controller", "Account Koor", "Sign In", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

exports.createPassResetOTP = (req,res) => {
  const { nim_koor } = req.body;
  Koor.count({
    where: {
      nim_koor: nim_koor
    }
  })
  .then(found0 => {
    if (found0 === 0) {
      return res.status(404).send({ message: "NIM Not Found." });
    } 
    else {
      PassResetKoor.update(
        {
          otp: generateOTP(),
          expired: 0
        }, 
        {
          where: { nim_koor: nim_koor }
        }
      )
      .then(() => {
        res.status(200).send({ message: "OTP Berhasil Dibuat! "});
      })
      .catch(err => {
        kode_error = 120301;
        techControl.addErrorLog(kode_error, "Controller", "Account Koor", "Create OTP", err.message);
        res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
      })
    }
  })
  .catch(err => {
    kode_error = 120300;
    techControl.addErrorLog(kode_error, "Controller", "Account Koor", "Create OTP", err.message);
    res.status(500).send({ message: "Telah terjadi kesalahan. Silahkan mencoba lagi. Kode Error: " + kode_error });
  })
}

exports.resetPassword = (req, res) => {
  const { nim_koor, otp, password } = req.body;
  PassResetKoor.count({
    where: {
      nim_koor: nim_koor
    }
  })
  .then(found1 => {
    if (found1 === 0) {
      return res.status(403).send({ message: "Password Reset Request Not Found." });
    } 
    else {
      PassResetKoor.count({
        where: {
          nim_koor: nim_koor,
          otp: otp
        }
      })
      .then(found2 => {
        if (found2 === 0) {
          return res.status(403).send({ message: "Invalid OTP." });
        }
        else {
          PassResetKoor.count({
            where: {
              nim_koor: nim_koor,
              otp: otp,
              expired: 0
            }
          }).
          then(found3 => {
            //cek apakah otp expired
            if (found3 === 0) {
              return res.status(403).send({ message: "OTP Expired." });
            }
            else {
              //update password
              Koor.update(
                {
                  password: bcrypt.hashSync(password, 8)
                },
                {
                  where: { nim_koor: nim_koor } 
                }
              )
              .then(() => {
                PassResetKoor.update(
                  {
                    expired: 1
                  },
                  {
                    where: { nim_koor: nim_koor }
                  }
                )
                .then(() => {
                  return res.status(200).send({ message: "Password Updated." });
                })
              })
            }
          })
        }
      })
    }
  })
}