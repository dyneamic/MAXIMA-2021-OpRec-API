const { authJwt } = require("../../middleware");
const mahasiswaController = require("../../controllers/mahasiswa/mahasiswa.controller");
const PDFController = require("../../controllers/mahasiswa/pdfDownload.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Bearer, Origin, Content-Type, Accept"
    );
    next();
  });

  //daftar cepat
  app.post(
    "/api/mhs/signup",
    [authJwt.isOprecMhsOpen],
    mahasiswaController.SignUp
  )
  
  //mahasiswa get data
  app.post(
    "/api/mhs/verify",
    [authJwt.isOprecMhsOpen],
    mahasiswaController.uniqueCheck
  )
  
  //mahasiswa liat status
  app.post(
    "/api/mhs/status",
    mahasiswaController.cekStatusForm
  )

  //mahasiswa liat pdf
  app.post(
    "/api/mhs/pdf_download",
    mahasiswaController.downloadPDF
  )
  
  //pdf sementara
  app.post(
    "/api/mhs/pdf_temp",
    [authJwt.isOprecMhsOpen],
    PDFController.createTempPDF
  )

  //check data
  app.post(
    "/api/mhs/zoom_link",
    [authJwt.isZoomOpen],
    mahasiswaController.createZoomLink
  )
};
