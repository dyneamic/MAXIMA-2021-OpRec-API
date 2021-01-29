module.exports = (sequelize, Sequelize) => {
  const KoorUpdateLog = sequelize.define("koor_update_log", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nim_koor: {
      type: Sequelize.INTEGER
    },
    nim_mhs: {
      type: Sequelize.INTEGER
    },
    update_type: {
      type: Sequelize.STRING
    },
    updated_value: {
      type: Sequelize.STRING
    }
  });

  return KoorUpdateLog;
};