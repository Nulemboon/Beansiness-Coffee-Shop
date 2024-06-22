const express = require('express');
const cartController = require('../controllers/cartController');
const {authMiddleware, roleMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, cartController.getCart);

router.get('/total', authMiddleware, cartController.getTotalAmount);

router.post('/', authMiddleware, cartController.addToCart);

router.delete('/', authMiddleware, cartController.removeFromCart);


module.exports = router;