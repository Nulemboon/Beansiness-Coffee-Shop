const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/pending', orderController.getPendingOrders);

router.get('/', orderController.getAllOrders);

router.post('/offline', orderController.offlineOrder);

router.post('/approve/:id', orderController.approveOrder);

router.post('/reject/:id', orderController.rejectOrder);

router.post('/', orderController.placeOrder);

module.exports = router;