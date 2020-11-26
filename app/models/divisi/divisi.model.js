module.exports = (sequelize, Sequelize) => {
  const Divisi = sequelize.define("divisi", {
    divisiID: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    nama_divisi: {
      type: Sequelize.STRING,
      primaryKey: true
    }
  });

  return Divisi;
};