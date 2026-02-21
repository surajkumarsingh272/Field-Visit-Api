const mysql = require("mysql2");

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const promisePool = connection.promise();

promisePool.getConnection()
  .then(conn => {
    console.log(" Database Connected Successfully!");
    conn.release();
  })
  .catch(err => {
    console.error(" Database Connection Failed:", err.message);
  });

module.exports = promisePool;