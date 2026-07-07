const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_DATABASE || 'library_db', 
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
});


pool.on('connect', () => {
    console.log('✅ Connected to PostgreSQL Database ("' + (process.env.DB_DATABASE || 'library_db') + '")');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error on idle client:', err.message);
});

module.exports = pool;