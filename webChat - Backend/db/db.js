const mysql = require('mysql2/promise');

const db = mysql.createPool({
    user: 'root',
    password:'root',
    host: '127.0.0.1',
    port: 3306,
    database: 'webchat',
});

module.exports = db;