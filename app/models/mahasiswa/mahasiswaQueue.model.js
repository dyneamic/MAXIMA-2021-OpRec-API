module.exports = (sequelize, Sequelize) => {
  const MahasiswaQueue = sequelize.define("mahasiswa_queue", {
    nim_mhs: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    divisiID: {
      type: Sequelize.STRING
    },
    no_urut: {
      type: Sequelize.INTEGER
    }
  });

  return MahasiswaQueue;
};