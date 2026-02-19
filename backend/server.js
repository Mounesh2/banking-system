require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bankRoutes = require('./routes/bankRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', bankRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.get('/', (req, res) => res.json({ message: 'KodBank API' }));

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`KodBank server running on port ${PORT}`));
}

module.exports = app;
