const { authJwt } = require("../../middleware");
const accMhsController = require("../../controllers/mahasiswa/accMhs.controller");
const mahasiswaController = require("../../controllers/mahasiswa/mahasiswa.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //mahasiswa daftar
  app.post(
    "/api/mahasiswa/register",
    mahasiswaController.registerMhs
  )

  //mahasiswa liat status
  app.get(
    "/api/mahasiswa/status",
    mahasiswaController.cekStatus
  )
};
