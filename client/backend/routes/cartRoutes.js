const express = require('express');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/', async (req, res) => {
    const cart = await cartController.getCartFromCookies(req, res);
    res.json(cart);
});

router.post('/', cartController.updateCart);
router.delete('/', cartController.removeFromCart);


module.exports = router;