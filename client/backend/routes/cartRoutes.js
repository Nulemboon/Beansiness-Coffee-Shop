const express = require('express');
const cartController = require('../controllers/cartController');
const {authenticate, roleMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, cartController.getCart);

router.get('/total', authenticate, cartController.getTotalAmount);

router.post('/', authenticate, cartController.addToCart);

router.post('/decrease', authenticate, cartController.decreaseCartItem);

router.post('/', authenticate, cartController.removeFromCart);


module.exports = router;