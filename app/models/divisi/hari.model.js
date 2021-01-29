module.exports = (sequelize, Sequelize) => {
  const HariWawancara = sequelize.define("hari_wawancara", {
    id_wawancara: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    tanggal: {
      type: Sequelize.DATE,
    },
  });

  return HariWawancara;
};