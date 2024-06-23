const express = require('express');
const cartController = require('../controllers/cartController');
const {authenticate, roleMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authenticate, roleMiddleware(['Customer']), cartController.getCart);

router.get('/total', authenticate, roleMiddleware(['Customer']), cartController.getTotalAmount);

router.post('/', authenticate, roleMiddleware(['Customer']), cartController.addToCart);

router.post('/decrease', authenticate, roleMiddleware(['Customer']), cartController.decreaseCartItem);

router.post('/', authenticate, roleMiddleware(['Customer']), cartController.removeFromCart);


module.exports = router;