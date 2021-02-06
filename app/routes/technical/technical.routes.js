const Technical = require("../../controllers/technical/technical.controller");
const authJwt = require("../../middleware/authJwt");
const MhsController = require("../../controllers/mahasiswa/mahasiswa.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Bearer, Origin, Content-Type, Accept"
      );
      next();
    });

    app.get(
        "/api/tech/db_server",
        Technical.getIsDatabaseOnline
    )

    app.get(
        "/api/tech/node_server",
        Technical.getIsServerOnline
    )
    
    //app.get(
    //    "/api/tech/api_key",
    //    [authJwt.verifyAPIKey],
    //    Technical.tesAPIKey
    //)
    
    app.get(
      "/api/tes/ip_test",
      Technical.checkIP
    )

    //app.get(
    //  "/api/tes/status_oprec",
    // authJwt.statusOprec
    //)
  };