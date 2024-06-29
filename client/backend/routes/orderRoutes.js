const express = require('express');
const orderController = require('../controllers/orderController');
const {authenticate, roleMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/pending', orderController.getPendingOrders);

router.get('/approved', orderController.getApprovedOrders); 

router.get('/:id', orderController.getOrderById);

router.get('/', orderController.getAllOrders);

router.post('/offline', authenticate, roleMiddleware(['Onsite','Admin']), orderController.offlineOrder);

router.post('/approve/:id', authenticate, roleMiddleware(['Onsite','Admin']), orderController.approveOrder);

router.post('/reject/:id', authenticate, roleMiddleware(['Onsite','Admin']), orderController.rejectOrder);

router.post('/cancel/:id', authenticate, roleMiddleware(['Customer']), orderController.cancelOrder);

router.post('/ship/:id', authenticate, roleMiddleware(['Shipper','Admin']), orderController.shipOrder);

router.post('/', authenticate, roleMiddleware(['Customer']), orderController.placeOrder);

module.exports = router;