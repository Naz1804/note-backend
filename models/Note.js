const pool = require('../config/db')

async function createNotesTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notes (
              id SERIAL PRIMARY KEY,
              user_id INTEGER NOT NULL, 
              title VARCHAR(255) NOT NULL,
              content TEXT NOT NULL,
              tags TEXT[],
              archived BOOLEAN DEFAULT false,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('Database Created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating table:', error);
        process.exit(1);
    }
}

module.exports = { createNotesTable };