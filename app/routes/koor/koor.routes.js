const { authJwt } = require("../../middleware");
const koorController = require("../../controllers/koor/koor.controller");
const accKoorController = require("../../controllers/koor/accKoor.controller");
const { koor } = require("../../models");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Bearer, Origin, Content-Type, Accept"
    );
    next();
  });

  //auths
  app.post(
    "/api/koor/signup",
    accKoorController.signUp
  )
  
  app.post(
    "/api/koor/signin",
    accKoorController.signIn
  )

  app.post(
    "/api/koor/reset_pass",
    accKoorController.resetPassword
  )

  app.post(
    "/api/koor/generate_otp",
    accKoorController.createPassResetOTP
  )
  //end of auths

  //superadmin
  app.post(
    "/api/admin/toggle_oprec",
    [authJwt.verifyToken, authJwt.isAdmin],
    koorController.updateOprecMhsStatus
  )

  app.post(
    "/api/admin/toggle_koor",
    [authJwt.verifyToken, authJwt.isAdmin],
    koorController.updateKoorStatus
  )
  
  app.post(
    "/api/admin/toggle_zoom",
    [authJwt.verifyToken, authJwt.isAdmin],
    koorController.updateZoomStatus
  )

  app.post(
    "/api/admin/toggle_mahasiswa_check",
    [authJwt.verifyToken, authJwt.isAdmin],
    koorController.updateMahasiswaCheckForm
  )

  app.post(
    "/api/admin/toggle_lulus_interview",
    [authJwt.verifyToken, authJwt.isAdmin],
    koorController.updateLulusInterview
  )

  app.get(
    "/api/admin/toggle_oprec_status",
    [authJwt.verifyToken],
    koorController.statusOprec
  )

  app.get(
    "/api/admin/toggle_koor_status",
    [authJwt.verifyToken],
    koorController.statusKoor
  )
  
  app.get(
    "/api/admin/toggle_zoom_status",
    [authJwt.verifyToken],
    koorController.statusZoom
  )

  app.get(
    "/api/admin/toggle_mahasiswa_check_status",
    [authJwt.verifyToken],
    koorController.statusMahasiswaCheckForm
  )

  app.get(
    "/api/admin/toggle_lulus_interview_status",
    [authJwt.verifyToken],
    koorController.statusLulusInterview
  )

  //bph
  app.post(
    "/api/koor/mahasiswa_all",
    [authJwt.verifyToken, authJwt.isAdminOrBPH],
    koorController.allMahasiswa
  )

  app.post(
    "/api/koor/antrian_all",
    [authJwt.verifyToken, authJwt.isAdminOrBPH],
    koorController.antrianMahasiswa
  )

  app.post(
    "/api/koor/update_zoom",
    [authJwt.verifyToken, authJwt.isAdminOrBPH],
    koorController.updateZoomLink
  )

  app.post(
    "/api/koor/current_zoom_link",
    [authJwt.verifyToken, authJwt.isAdminOrBPH],
    koorController.currentZoomLink
  )

  //per divisi
  app.post(
    "/api/koor/antrian_divisi",
    [authJwt.verifyToken],
    koorController.antrianByDivisi
  )

  app.post(
    "/api/koor/mahasiswa_divisi",
    [authJwt.verifyToken],
    koorController.byDivisi
  )

  //update status
  app.post(
    "/api/koor/seleksi_form",
    [authJwt.verifyToken, authJwt.isKoorUpdateOpen],
    koorController.seleksiForm
  )

  app.post(
    "/api/koor/tanggal_interview",
    [authJwt.verifyToken, authJwt.isKoorUpdateOpen],
    koorController.updateJadwalInterview
  )
  
  app.post(
    "/api/koor/hasil_interview",
    [authJwt.verifyToken, authJwt.isLulusInterviewOpen],
    koorController.hasilInterview
  )

  app.post(
    "/api/koor/download_pdf_mhs",
    [authJwt.verifyToken],
    koorController.downloadPDF
  )
};
