const mysql = require('mysql')
const dotEnv = require('dotenv')

dotEnv.config({path: './.env'})

const db = mysql.createPool({
    host: process.env.HOSTDB,
    user: process.env.USERDB,
    password: process.env.PASSWORDDB,
    database: process.env.DBNAME,
})

module.exports = db