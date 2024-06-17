const express = require('express');
const accountController = require('../controllers/accountController');
const voucherController = require('../controllers/voucherController');

const router = express.Router();

router.get('/:id', accountController.getAccountById);

router.get('/', accountController.getAllAccounts);

router.post('/:id/vouchers/add', voucherController.addUserVoucher);
router.pose('/:id/vouchers/remove', voucherController.removeUserVoucher);



module.exports = router;