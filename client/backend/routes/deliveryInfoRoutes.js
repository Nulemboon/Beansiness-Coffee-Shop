const express = require('express');
const deliveryInfoController = require('../controllers/deliveryInfoController');
const {authMiddleware, roleMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', deliveryInfoController.createDeliveryInfo);

router.delete('/:id', deliveryInfoController.deleteDeliveryInfo);

module.exports = router;