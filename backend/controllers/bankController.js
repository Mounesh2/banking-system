const db = require('../config/db');

exports.getBalance = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT customer_name, email, account_balance FROM bankuser WHERE customer_id = ?',
      [req.user.customerId]
    );
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const [transactions] = await db.query(`
      SELECT 
        t.transaction_id,
        t.amount,
        t.transaction_date,
        CASE 
          WHEN t.sender_id = ? THEN 'sent'
          ELSE 'received'
        END as type,
        CASE 
          WHEN t.sender_id = ? THEN r.customer_name
          ELSE s.customer_name
        END as other_party,
        CASE 
          WHEN t.sender_id = ? THEN r.email
          ELSE s.email
        END as other_email
      FROM transactions t
      JOIN bankuser s ON t.sender_id = s.customer_id
      JOIN bankuser r ON t.receiver_id = r.customer_id
      WHERE t.sender_id = ? OR t.receiver_id = ?
      ORDER BY t.transaction_date DESC
      LIMIT 20
    `, [req.user.customerId, req.user.customerId, req.user.customerId, req.user.customerId, req.user.customerId]);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.transfer = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const { recipient_email, amount } = req.body;
    const senderId = req.user.customerId;

    if (!recipient_email || !amount) return res.status(400).json({ message: 'Recipient email and amount required' });
    if (amount <= 0) return res.status(400).json({ message: 'Amount must be positive' });

    await connection.beginTransaction();

    const [sender] = await connection.query('SELECT * FROM bankuser WHERE customer_id = ? FOR UPDATE', [senderId]);
    if (sender.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Sender not found' });
    }

    if (sender[0].account_balance < amount) {
      await connection.rollback();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const [recipient] = await connection.query('SELECT * FROM bankuser WHERE email = ? FOR UPDATE', [recipient_email]);
    if (recipient.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Recipient not found' });
    }

    if (sender[0].customer_id === recipient[0].customer_id) {
      await connection.rollback();
      return res.status(400).json({ message: 'Cannot transfer to yourself' });
    }

    await connection.query('UPDATE bankuser SET account_balance = account_balance - ? WHERE customer_id = ?', [amount, senderId]);
    await connection.query('UPDATE bankuser SET account_balance = account_balance + ? WHERE customer_id = ?', [amount, recipient[0].customer_id]);

    // Record transaction
    await connection.query(
      'INSERT INTO transactions (sender_id, receiver_id, amount) VALUES (?, ?, ?)',
      [senderId, recipient[0].customer_id, amount]
    );

    await connection.commit();
    res.json({ message: 'Transfer successful', newBalance: sender[0].account_balance - amount });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Transfer failed' });
  } finally {
    connection.release();
  }
};
