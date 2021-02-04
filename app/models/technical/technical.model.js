module.exports = (sequelize, Sequelize) => {
    const Technical = sequelize.define("technical", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      value_desc: {
        type: Sequelize.STRING
      },
      value_message: {
        type: Sequelize.STRING
      }
    });
  
    return Technical;
  };