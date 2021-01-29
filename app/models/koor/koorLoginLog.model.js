module.exports = (sequelize, Sequelize) => {
  const KoorLoginLog = sequelize.define("koor_login_log", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nim_koor: {
      type: Sequelize.INTEGER
    },
    ip_address: {
      type: Sequelize.STRING
    }
  });

  return KoorLoginLog;
};