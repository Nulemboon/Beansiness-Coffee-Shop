const express = require('express');
const accountController = require('../controllers/accountController');
const voucherController = require('../controllers/voucherController');
const {authenticate, roleMiddleware} = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/current', authenticate, roleMiddleware(['Admin', 'Onsite', 'Customer']),  accountController.getCurAccount);

router.get('/:id', accountController.getAccountById);

router.get('/', accountController.getAllAccounts);

router.post('/register', accountController.registerUser);

router.post('/login', accountController.loginUser);

router.post('/logout', (req, res) => {
    res.clearCookie('cart');
    res.status(200).json({ message: 'Logged out successfully' });
});

router.post('/vouchers/add', authenticate, roleMiddleware(['Customer']), voucherController.addVoucherUser);

router.post('/vouchers/remove', authenticate, roleMiddleware(['Customer']), voucherController.removeVoucherUser);

router.post('/add', accountController.addAccount);

router.delete('/:id', accountController.removeAccount);

router.post('/change-password', authenticate,roleMiddleware(['Customer']), accountController.changePassword);

module.exports = router;