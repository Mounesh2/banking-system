const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.updateProfile = async (req, res) => {
  try {
    const { customer_name, email } = req.body;
    const customerId = req.user.customerId;

    const [existing] = await db.query('SELECT * FROM bankuser WHERE email = ? AND customer_id != ?', [email, customerId]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already in use' });

    await db.query('UPDATE bankuser SET customer_name = ?, email = ? WHERE customer_id = ?', [customer_name, email, customerId]);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const customerId = req.user.customerId;

    const [users] = await db.query('SELECT * FROM bankuser WHERE customer_id = ?', [customerId]);
    if (users.length === 0) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(current_password, users[0].customer_password);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db.query('UPDATE bankuser SET customer_password = ? WHERE customer_id = ?', [hashedPassword, customerId]);
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
