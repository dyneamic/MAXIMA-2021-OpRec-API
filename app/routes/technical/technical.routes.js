const Technical = require("../../controllers/technical/technical.controller");
const authJwt = require("../../middleware/authJwt");
const GSheetsController = require("../../controllers/mahasiswa/gSheets.controller");
const PDFController = require("../../controllers/mahasiswa/pdfDownload.controller");
const MhsController = require("../../controllers/mahasiswa/mahasiswa.controller");

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "Bearer, x-api-key, Origin, Content-Type, Accept"
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
    
    app.get(
        "/api/tech/api_key",
        [authJwt.verifyAPIKey],
        Technical.tesAPIKey
    )
    
    app.get(
      "/api/tes/ip_test",
      Technical.checkIP
    )
  };