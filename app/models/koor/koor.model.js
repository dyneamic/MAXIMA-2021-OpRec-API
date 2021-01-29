module.exports = (sequelize, Sequelize) => {
  const Koor = sequelize.define("koor", {
    nim_koor: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    divisiID: {
      type: Sequelize.STRING
    }
  });

  return Koor;
};