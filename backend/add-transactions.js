require('dotenv').config();
const mysql = require('mysql2/promise');

async function addTransactionTable() {
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
      CREATE TABLE IF NOT EXISTS transactions (
        transaction_id INT PRIMARY KEY AUTO_INCREMENT,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES bankuser(customer_id),
        FOREIGN KEY (receiver_id) REFERENCES bankuser(customer_id)
      )
    `);
    console.log('✓ Transaction table created');

    await connection.end();
    console.log('\n✅ Transaction history feature added!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addTransactionTable();
