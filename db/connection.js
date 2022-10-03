const mysql = require('mysql2');
require('dotenv').config()

const db = mysql.createConnection({
  host: process.env.db_host,
  // Your MySQL username,
  user: process.env.db_user,
  // Your MySQL password
  password: process.env.db_password,
  database: 'employees'
});




module.exports = db;