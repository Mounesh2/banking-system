require('dotenv').config();
const mysql = require('mysql2/promise');

async function setupDatabase() {
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

    // Create bankuser table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bankuser (
        customer_id INT PRIMARY KEY AUTO_INCREMENT,
        customer_name VARCHAR(100) NOT NULL,
        customer_password VARCHAR(255) NOT NULL,
        account_balance DECIMAL(10,2) DEFAULT 1000.00,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table bankuser created');

    // Create bankuser_jwt table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bankuser_jwt (
        token_id INT PRIMARY KEY AUTO_INCREMENT,
        token_value TEXT NOT NULL,
        customer_id INT NOT NULL,
        token_expiry DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES bankuser(customer_id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Table bankuser_jwt created');

    // Create indexes
    try {
      await connection.query(`CREATE INDEX idx_customer_id ON bankuser_jwt(customer_id)`);
    } catch (e) {}
    try {
      await connection.query(`CREATE INDEX idx_token_expiry ON bankuser_jwt(token_expiry)`);
    } catch (e) {}
    console.log('✓ Indexes created');

    console.log('\n✅ Database setup complete!');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupDatabase();
