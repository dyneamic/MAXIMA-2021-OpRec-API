module.exports = (sequelize, Sequelize) => {
  const Koor = sequelize.define("koor", {
    nim: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    nama: {
      type: Sequelize.STRING
    },
    email: {
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