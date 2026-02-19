-- KodBank Database Schema

-- Table 1: bankuser
CREATE TABLE bankuser (
    customer_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_password VARCHAR(255) NOT NULL,
    account_balance DECIMAL(10,2) DEFAULT 10000.00,
    email VARCHAR(100) UNIQUE NOT NULL,
    security_question VARCHAR(50) DEFAULT 'pet',
    security_answer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: bankuser_jwt
CREATE TABLE bankuser_jwt (
    token_id INT PRIMARY KEY AUTO_INCREMENT,
    token_value TEXT NOT NULL,
    customer_id INT NOT NULL,
    token_expiry DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES bankuser(customer_id) ON DELETE CASCADE
);

-- Index for faster token lookup
CREATE INDEX idx_customer_id ON bankuser_jwt(customer_id);
CREATE INDEX idx_token_expiry ON bankuser_jwt(token_expiry);
