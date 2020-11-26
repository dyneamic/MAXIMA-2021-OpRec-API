module.exports = (sequelize, Sequelize) => {
  const StatusName = sequelize.define("status_name", {
    statusID: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  });

  return StatusName;
};