module.exports = (sequelize, Sequelize) => {
  const KoorPasswordReset = sequelize.define("koor_password_reset", {
      nim: {
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
  return KoorPasswordReset;
};