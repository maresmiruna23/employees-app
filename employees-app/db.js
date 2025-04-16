var mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to DB:', err.stack);
    return ;
  }
  console.log('Connected to MySQL DB as ID', connection.threadId);
});
module.export=connection;