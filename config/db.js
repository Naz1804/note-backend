const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_3frGvy0xDYUB@ep-divine-water-abhatek3-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=verify-full',
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;