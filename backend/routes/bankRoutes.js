const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');

router.get('/balance', authMiddleware, bankController.getBalance);
router.post('/transfer', authMiddleware, bankController.transfer);
router.get('/transactions', authMiddleware, bankController.getTransactions);
router.put('/profile', authMiddleware, profileController.updateProfile);
router.put('/change-password', authMiddleware, profileController.changePassword);

module.exports = router;
