const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/', authMiddleware, orderController.getAllOrders);

router.post('/offline', orderController.offlineOrder);

router.post('/', orderController.placeOrder);

module.exports = router;