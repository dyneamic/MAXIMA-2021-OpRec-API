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
  
  //bph
  app.post(
    "/api/koor/mahasiswa_all",
    [authJwt.verifyToken, authJwt.isAdminOrBPH],
    koorController.allMahasiswa
  )

  //per divisi
  app.post(
    "/api/koor/mahasiswa_divisi",
    [authJwt.verifyToken],
    koorController.byDivisi
  )

  //update status
  app.post(
    "/api/koor/seleksi_form",
    [authJwt.verifyToken],
    koorController.seleksiForm
  )

  app.post(
    "/api/koor/tanggal_interview",
    [authJwt.verifyToken],
    koorController.updateJadwalInterview
  )
  
  app.post(
    "/api/koor/hasil_interview",
    [authJwt.verifyToken],
    koorController.hasilInterview
  )
};
