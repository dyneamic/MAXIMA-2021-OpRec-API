const db = require("../../models");
const config = require("../../config/auth.config");
const Koor = db.koor;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signUp = (req, res) => {
  const { nim, name, email, password, divisiID } = req.body;
  Koor.count({
    where: {
      nim: nim
    }
  })
  .then(counts => {
    if (counts >= 1) {
      res.status(403).send({ message: "Sudah pernah mendaftar sebelumnya!"});
    }
    else {
      Koor.create({
        nim: nim,
        name: name,
        email: email,
        password: bcrypt.hashSync(password, 8),
        divisiID: divisiID
      })
      .then(response => {
        res.status(200).send({ message: "Berhasil mendaftar! "});
      });
    }
  });
}

exports.signIn = (req,res) => {
  const { nim, password } = req.body;
  Koor.findOne({
    where: { nim: nim}
  })
  .then(koor => {
    if (!koor) {
      return res.status(403).send({ message: "User Not found." });
    }

    let passwordIsValid = bcrypt.compareSync(
      password,
      koor.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!"
      });
    }

    let token = jwt.sign({ nim: koor.nim, divisiID: koor.divisiID }, config.secret, {
      expiresIn: 3600 // 1 hour
    });

    res.status(200).send({
      accessToken: token,
      name: koor.name
    })
  })
}

exports.resetPassword = (req, res) => {
  const { nim, otp, password } = req.body;
  PassReset.count({
    where: {
      nim: nim
    }
  })
  .then(found1 => {
    if (found1 == 0) {
      return res.status(403).send({ message: "Password Reset Request Not Found." });
    } else {
      PassReset.count({
        where: {
          nim: nim,
          otp: otp
        }
      })
      .then(found2 => {
        if (found2 == 0) {
          return res.status(403).send({ message: "Invalid OTP." });
        }
        else {
          PassReset.count({
            where: {
              nim: nim,
              otp: otp,
              expired: 0
            }
          }).
          then(found3 => {
            //cek apakah otp expired
            if (found3 == 0) {
              return res.status(403).send({ message: "OTP Expired." });
            }
            else {
              //update password
              User.update(
                {
                  password: bcrypt.hashSync(password, 8)
                },
                {
                  where: { nim: nim } 
                }
              )
              .then(rowsUpdated => {
                if (rowsUpdated == 1) {
                  PassReset.update(
                    {
                      expired: 1
                    },
                    {
                      where: { nim: nim }
                    }
                  )
                  .then(() => {
                    return res.status(200).send({ message: "Password Updated." });
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}