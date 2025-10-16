//pool connection to PostgreSQL DB
const { Pool } = require('pg');
require('dotenv').config({path: '../dotenv/.env'});

//console.log("DB_USER:", process.env.DB_USER);
//console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
//console.log("Type of DB_PASSWORD:", typeof process.env.DB_PASSWORD);


// Database connection configuration:....................................
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
    });

module.exports = pool;
//.......................................................................