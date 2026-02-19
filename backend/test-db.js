require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false }
    });

    console.log('✓ Database connected successfully');

    const [tables] = await connection.query('SHOW TABLES');
    console.log('\nTables in database:', tables);

    if (tables.length === 0) {
      console.log('\n⚠ No tables found! Run schema.sql on your Aiven database.');
    }

    await connection.end();
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
  }
}

testConnection();
