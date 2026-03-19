const pool = require('../config/db')

async function createUsersTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
              id SERIAL PRIMARY KEY,
              email VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255),
              color_theme VARCHAR(20) DEFAULT 'light',
              font_theme VARCHAR(20) DEFAULT 'sans-serif',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              google_id VARCHAR(255) UNIQUE
            )
        `);

        console.log('Database Created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
}

module.exports = { createUsersTable };