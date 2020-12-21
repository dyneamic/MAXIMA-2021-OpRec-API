module.exports = (sequelize, Sequelize) => {
  const Divisi = sequelize.define("divisi", {
    divisiID: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      primaryKey: true
    }
  });

  return Divisi;
};