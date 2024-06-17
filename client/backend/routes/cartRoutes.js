const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/', cartController.getCart);

router.post('/', cartController.addToCart);

router.delete('/', cartController.removeFromCart);


module.exports = router;