module.exports = (sequelize, Sequelize) => {
  const MhsPasswordReset = sequelize.define("mhs_password_reset", {
      nim_mhs: {
          type: Sequelize.INTEGER,
          primaryKey: true
      },
      otp: {
          type: Sequelize.STRING
      },
      expired: {
          type: Sequelize.INTEGER
      }
  });
  return MhsPasswordReset;
};