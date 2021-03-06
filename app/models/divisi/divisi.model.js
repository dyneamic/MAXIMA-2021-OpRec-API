module.exports = (sequelize, Sequelize) => {
  const Divisi = sequelize.define("divisi", {
    divisiID: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    line_group_link: {
      type: Sequelize.STRING
    },
    line_qr_link: {
      type: Sequelize.STRING
    }
  });

  return Divisi;
};