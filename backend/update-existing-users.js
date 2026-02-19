require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function updateExistingUsers() {
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

    // Default security answer: "kodbank" (hashed)
    const defaultAnswer = await bcrypt.hash('kodbank', 10);

    await connection.query(`
      UPDATE bankuser 
      SET security_question = 'pet', 
          security_answer = ?
      WHERE security_question IS NULL OR security_answer IS NULL
    `, [defaultAnswer]);

    console.log('✓ Updated existing users with default security question');
    console.log('  Question: What is your pet\'s name?');
    console.log('  Answer: kodbank');

    await connection.end();
    console.log('\n✅ All existing users updated!');
    console.log('They can now use "kodbank" as the answer to reset password.');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateExistingUsers();
