const config = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//divisi
db.divisi = require("../models/divisi/divisi.model")(sequelize, Sequelize);
//end of divisi

//status//
db.status = require("../models/divisi/status.model")(sequelize, Sequelize);
//end of status//

//koor
db.koor = require("../models/koor/koor.model")(sequelize, Sequelize);
db.passwordResetKoor = require("../models/koor/passwordResetKoor.model")(sequelize, Sequelize);

db.divisi.hasMany(db.koor, { foreignKey: 'divisiID'});
db.koor.belongsTo(db.divisi, { foreignKey: 'divisiID'});
db.koor.hasMany(db.passwordResetKoor, { foreignKey: 'nim'});
db.passwordResetKoor.belongsTo(db.koor, { foreignKey: 'nim'});
//end of koor

//registration
db.mahasiswa = require("../models/mahasiswa/mahasiswa.model")(sequelize, Sequelize);
db.passwordResetMahasiswa = require("../models/mahasiswa/passwordResetMhs.model")(sequelize, Sequelize);

//db.mahasiswa.hasMany(db.mahasiswaDivisi, { foreignKey: 'nim'});
//db.mahasiswaDivisi.belongsTo(db.mahasiswa, { foreignKey: 'nim'});
db.divisi.hasMany(db.mahasiswa, { foreignKey: 'divisiID'});
db.mahasiswa.belongsTo(db.divisi, { foreignKey: 'divisiID'});
db.status.hasMany(db.mahasiswa, { foreignKey: 'statusID'});
db.mahasiswa.belongsTo(db.status, { foreignKey: 'statusID'});
db.mahasiswa.hasMany(db.passwordResetMahasiswa, { foreignKey: 'nim'});
db.passwordResetMahasiswa.belongsTo(db.mahasiswa, { foreignKey: 'nim' });
//end of registration

//technical//
db.technical = require("../models/technical/technical.model")(sequelize, Sequelize);
//end of technical
//db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
