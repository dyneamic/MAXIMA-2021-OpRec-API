module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASS,
  DB: "oprec_mxm",
  dialect: "mysql",
  pool: {
    max: 3000,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};