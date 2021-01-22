const { authJwt } = require("../../middleware");
const accMhsController = require("../../controllers/mahasiswa/accMhs.controller");
const mahasiswaController = require("../../controllers/mahasiswa/mahasiswa.controller");
const PDFController = require("../../controllers/mahasiswa/pdfDownload.controller");

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
  
  //mahasiswa get data
  app.post(
    "/api/mhs/verify",
    mahasiswaController.uniqueCheck
  )
  
  //mahasiswa liat status
  app.post(
    "/api/mhs/status",
    mahasiswaController.cekStatus
  )

  //mahasiswa liat pdf
  app.post(
    "/api/mhs/pdf_download",
    mahasiswaController.downloadPDF
  )
  
  //pdf sementara
  app.post(
    "/api/mhs/pdf_temp",
    PDFController.createTempPDF
  )
};
