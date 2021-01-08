const { authJwt } = require("../../middleware");
const accMhsController = require("../../controllers/mahasiswa/accMhs.controller");
const mahasiswaController = require("../../controllers/mahasiswa/mahasiswa.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Bearer, x-api-key, Origin, Content-Type, Accept"
    );
    next();
  });

  //daftar cepat
  app.post(
    "/api/mhs/signup",
    mahasiswaController.SignUp
  )
  
  /*
  //mahasiswa daftar akun
  app.post(
    "/api/mhs/signup",
    accMhsController.signUp
  )
  */

  //mahasiswa login akun
  app.post(
    "/api/mhs/signin",
    accMhsController.signIn
  )
  
  //mahasiswa get data
  app.post(
    "/api/mhs/get_data",
    [authJwt.verifyToken],
    mahasiswaController.getData
  )
  //mahasiswa update data
  /*
  app.post(
    "/api/mhs/update_data",
    [authJwt.verifyToken],
    mahasiswaController.updateData
  )
  */
  
  //mahasiswa liat status
  app.post(
    "/api/mhs/status",
    mahasiswaController.cekStatus
  )
};
