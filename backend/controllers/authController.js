const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { customer_name, email, customer_password, security_question, security_answer } = req.body;
    if (!customer_name || !email || !customer_password || !security_answer) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const [existing] = await db.query('SELECT * FROM bankuser WHERE email = ?', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(customer_password, 10);
    const hashedAnswer = await bcrypt.hash(security_answer.toLowerCase(), 10);
    const [result] = await db.query(
      'INSERT INTO bankuser (customer_name, email, customer_password, account_balance, security_question, security_answer) VALUES (?, ?, ?, 1000.00, ?, ?)',
      [customer_name, email, hashedPassword, security_question, hashedAnswer]
    );

    res.status(201).json({ message: 'Registration successful', customerId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, customer_password } = req.body;
    if (!email || !customer_password) return res.status(400).json({ message: 'Email and password required' });

    const [users] = await db.query('SELECT * FROM bankuser WHERE email = ?', [email]);
    if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = users[0];
    const isMatch = await bcrypt.compare(customer_password, user.customer_password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ customerId: user.customer_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    await db.query(
      'INSERT INTO bankuser_jwt (token_value, customer_id, token_expiry) VALUES (?, ?, ?)',
      [token, user.customer_id, expiryDate]
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600000
    });

    res.json({ message: 'Login successful', user: { customerId: user.customer_id, customerName: user.customer_name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (token) await db.query('DELETE FROM bankuser_jwt WHERE token_value = ?', [token]);
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, security_answer, new_password } = req.body;
    
    // Step 1: Get security question
    if (!security_answer && !new_password) {
      const [users] = await db.query('SELECT security_question FROM bankuser WHERE email = ?', [email]);
      if (users.length === 0) return res.status(404).json({ message: 'Email not found' });
      return res.json({ security_question: users[0].security_question });
    }
    
    // Step 2: Verify answer and reset password
    const [users] = await db.query('SELECT * FROM bankuser WHERE email = ?', [email]);
    if (users.length === 0) return res.status(404).json({ message: 'Email not found' });
    
    const isMatch = await bcrypt.compare(security_answer.toLowerCase(), users[0].security_answer);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect security answer' });
    
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE bankuser SET customer_password = ? WHERE email = ?', [hashedPassword, email]);
    
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
