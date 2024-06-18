const express = require('express');
const accountController = require('../controllers/accountController');
const voucherController = require('../controllers/voucherController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', accountController.getAccountById);

router.get('/', accountController.getAllAccounts);

router.post('/register', accountController.registerUser);

router.post('/login', accountController.loginUser)

router.post('/:id/vouchers/add', voucherController.addVoucherUser);

router.post('/:id/vouchers/remove', voucherController.removeVoucherUser);

router.post('/add', accountController.addAccount);

router.delete('/:id', accountController.removeAccount);

module.exports = router;