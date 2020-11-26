module.exports = (sequelize, Sequelize) => {
  const MahasiswaDivisi = sequelize.define("mahasiswa_divisi", {
    nim: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    divisiID: {
      type: Sequelize.STRING
    },
    statusID: {
      type: Sequelize.INTEGER
    }
  });

  return MahasiswaDivisi;
};