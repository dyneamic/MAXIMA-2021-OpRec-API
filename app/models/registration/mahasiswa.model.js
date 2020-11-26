module.exports = (sequelize, Sequelize) => {
  const Mahasiswa = sequelize.define("mahasiswa", {
    nim: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    nama: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING
    },
    prodi: {
      type: Sequelize.STRING
    },
    angkatan: {
      type: Sequelize.INTEGER
    },
    no_hp: {
      type: Sequelize.STRING
    },
    uLine: {
      type: Sequelize.STRING
    },
    uInstagram: {
      type: Sequelize.STRING
    }
  });

  return Mahasiswa;
};