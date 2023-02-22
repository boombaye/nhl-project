const mysql = require('mysql2/promise')
const config = require('config')
const pool = mysql.createPool({
    host: config.get('host'),
    user:config.get('user'),
    password:process.env.password,
    database:config.get('database')
})
module.exports = pool