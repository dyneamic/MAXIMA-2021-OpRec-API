const { authJwt } = require("../../middleware");
const koorController = require("../../controllers/koor/koor.controller");
const accKoorController = require("../../controllers/koor/accKoor.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Bearer, x-api-key, Origin, Content-Type, Accept"
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
  //end of auths

  //all
  app.get(
    "/api/koor/mahasiswa_all",
    [authJwt.verifyToken, authJwt.isAdmin],
    koorController.allMahasiswa
  )

  //per divisi
  app.get(
    "/api/koor/mahasiswa_divisi",
    [authJwt.verifyToken, authJwt.isKoor],
    koorController.byDivisi
  )

  //update status
  app.post(
    "/api/koor/update_status_mhs",
    [authJwt.verifyToken, authJwt.isKoor],
    koorController.updateStatus
  )
};
