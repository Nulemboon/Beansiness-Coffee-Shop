const express = require('express');
const deliveryInfoController = require('../controllers/deliveryInfoController');
const {authenticate, roleMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, roleMiddleware(['Customer']), deliveryInfoController.createDeliveryInfo);

router.delete('/:id', authenticate, roleMiddleware(['Customer']), deliveryInfoController.deleteUserDeliveryInfo);

module.exports = router;