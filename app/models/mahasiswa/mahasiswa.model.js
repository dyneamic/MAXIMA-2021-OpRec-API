module.exports = (sequelize, Sequelize) => {
  const Mahasiswa = sequelize.define("mahasiswa", {
    nim: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING
    },
    divisiID: {
      type: Sequelize.STRING
    },
    statusID: {
      type: Sequelize.INTEGER
    },
    no_hp: {
      type: Sequelize.STRING
    },
    token: {
      type: Sequelize.STRING
    },
    tempat_lahir: {
      type: Sequelize.STRING
    },
    tanggal_lahir: {
      type: Sequelize.DATE
    },
    jenis_kelamin: {
      type: Sequelize.STRING
    },
    alamat: {
      type: Sequelize.STRING
    },
    angkatan: {
      type: Sequelize.INTEGER
    },
    fakultas: {
      type: Sequelize.STRING
    },
    prodi: {
      type: Sequelize.STRING
    },
    ips: {
      type: Sequelize.FLOAT
    },
    whatsapp: {
      type: Sequelize.STRING
    },
    uLine: {
      type: Sequelize.STRING
    },
    uInstagram: {
      type: Sequelize.STRING
    },
    soal1: {
      type: Sequelize.TEXT
    },
    soal2: {
      type: Sequelize.TEXT
    },
    soal3: {
      type: Sequelize.TEXT
    },
    pdfLink: {
      type: Sequelize.STRING
    },
    lastUpdatedBy: {
      type: Sequelize.INTEGER
    }
  });

  return Mahasiswa;
};