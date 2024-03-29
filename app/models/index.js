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

//koor
db.koor = require("../models/koor/koor.model")(sequelize, Sequelize);
db.passwordResetKoor = require("../models/koor/passwordResetKoor.model")(sequelize, Sequelize);
db.koorLoginLog = require("../models/koor/koorLoginLog.model")(sequelize, Sequelize);
db.koorUpdateLog = require("../models/koor/koorUpdateLog.model")(sequelize, Sequelize);

db.divisi.hasMany(db.koor, { foreignKey: 'divisiID'});
db.koor.belongsTo(db.divisi, { foreignKey: 'divisiID'});
db.koor.hasMany(db.passwordResetKoor, { foreignKey: 'nim_koor'});
db.passwordResetKoor.belongsTo(db.koor, { foreignKey: 'nim_koor'});
db.koor.hasMany(db.koorLoginLog, { foreignKey: 'nim_koor'});
db.koorLoginLog.belongsTo(db.koor, { foreignKey: 'nim_koor'});
db.koor.hasMany(db.koorUpdateLog, { foreignKey: 'nim_koor'});
db.koorUpdateLog.belongsTo(db.koor, { foreignKey: 'nim_koor'});
//end of koor

//registration
db.mahasiswa = require("../models/mahasiswa/mahasiswa.model")(sequelize, Sequelize);
db.divisi.hasMany(db.mahasiswa, { foreignKey: 'divisiID'});
db.mahasiswa.belongsTo(db.divisi, { foreignKey: 'divisiID'});
db.mahasiswa.hasMany(db.koorUpdateLog, { foreignKey: 'nim_mhs'});
db.koorUpdateLog.belongsTo(db.mahasiswa, { foreignKey: 'nim_mhs'});

db.mahasiswaQueue = require("../models/mahasiswa/mahasiswaQueue.model")(sequelize, Sequelize);
db.mahasiswa.hasMany(db.mahasiswaQueue, { foreignKey: 'nim_mhs'});
db.divisi.hasMany(db.mahasiswaQueue, { foreignKey: 'divisiID'});
db.mahasiswaQueue.belongsTo(db.mahasiswa, { foreignKey: 'nim_mhs'});
db.mahasiswaQueue.belongsTo(db.divisi, { foreignKey: 'divisiID'});
//end of registration

//technical//
db.technical = require("../models/technical/technical.model")(sequelize, Sequelize);
db.errorLogs = require("../models/technical/error_logs.model")(sequelize, Sequelize);
//end of technical
//db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
