module.exports = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "oprec_mxm",
  dialect: "mysql",
  pool: {
    max: 3000,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};