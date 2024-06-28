const express = require('express');
const cartController = require('../controllers/cartController');
const {authenticate, roleMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/total', cartController.getTotalAmount);

router.get('/clear', cartController.clearCart)

router.get('/', cartController.getCart);

router.post('/decrease', cartController.decreaseCartItem);

router.post('/remove', cartController.removeFromCart);

router.post('/', cartController.addToCart);

module.exports = router;