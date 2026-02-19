require('dotenv').config();
const mysql = require('mysql2/promise');

async function deleteAllUsers() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      ssl: { rejectUnauthorized: false }
    });

    console.log('✓ Connected to database');

    await connection.query('DELETE FROM bankuser_jwt');
    console.log('✓ Deleted all JWT tokens');

    await connection.query('DELETE FROM bankuser');
    console.log('✓ Deleted all users');

    await connection.end();
    console.log('\n✅ All users removed! Database is clean.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

deleteAllUsers();
