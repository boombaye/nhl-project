const mysql = require('mysql2/promise')
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'Boombaye07131984!',
    database:'sports_radar_nhl'
})
module.exports = pool