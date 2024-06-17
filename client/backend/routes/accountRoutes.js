const express = require('express');
const accountController = require('../controllers/accountController');
const voucherController = require('../controllers/voucherController');

const router = express.Router();

router.get('/:id', accountController.getAccountById);

router.get('/', accountController.getAllAccounts);

router.post('/:id/vouchers', voucherController.updateUserVoucher);



module.exports = router;