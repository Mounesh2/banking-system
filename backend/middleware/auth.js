const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query(
      'SELECT * FROM bankuser_jwt WHERE token_value = ? AND customer_id = ? AND token_expiry > NOW()',
      [token, decoded.customerId]
    );

    if (rows.length === 0) return res.status(401).json({ message: 'Invalid or expired token' });

    req.user = { customerId: decoded.customerId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
