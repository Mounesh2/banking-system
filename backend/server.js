require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const bankRoutes = require('./routes/bankRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Manual CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', bankRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.get('/', (req, res) => res.json({ message: 'KodBank API', frontend: process.env.FRONTEND_URL }));

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`KodBank server running on port ${PORT}`));
}

module.exports = app;
