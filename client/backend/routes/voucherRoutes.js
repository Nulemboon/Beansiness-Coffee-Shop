const express = require('express');
const voucherController = require('../controllers/voucherController');

const router = express.Router();
router.get('/', voucherController.getVoucher);

router.post('/', voucherController.addVoucher);

router.delete('/:id', voucherController.removeVoucher);

module.exports = router;