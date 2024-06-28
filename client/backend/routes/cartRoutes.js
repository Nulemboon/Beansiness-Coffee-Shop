const express = require('express');
const cartController = require('../controllers/cartController');
const {authenticate, roleMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, roleMiddleware(['Customer', 'Onsite']), cartController.getCart);

router.get('/total', authenticate, roleMiddleware(['Customer', 'Onsite']), cartController.getTotalAmount);

router.post('/', authenticate, roleMiddleware(['Customer', 'Onsite']), cartController.addToCart);

router.post('/decrease', authenticate, roleMiddleware(['Customer', 'Onsite']), cartController.decreaseCartItem);

router.post('/remove', authenticate, roleMiddleware(['Customer', 'Onsite']), cartController.removeFromCart);

router.get('/clear', authenticate, roleMiddleware(['Customer', 'Onsite']), cartController.clearCart)

module.exports = router;