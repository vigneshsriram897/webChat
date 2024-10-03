const db = require('../db/db');

async function createUserTable() {
    try {
        await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255)
      );
    `);
        console.log('User table created successfully');
    } catch (err) {
        console.error('Error creating user table:', err);
    }
}

createUserTable();