require('dotenv').config();
const mysql = require('mysql2/promise');

async function addSecurityQuestion() {
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

    await connection.query(`
      ALTER TABLE bankuser 
      ADD COLUMN security_question VARCHAR(255),
      ADD COLUMN security_answer VARCHAR(255)
    `);
    console.log('✓ Security question columns added');

    await connection.end();
    console.log('\n✅ Database updated!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addSecurityQuestion();
