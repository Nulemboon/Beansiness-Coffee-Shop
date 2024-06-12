const express = require('express');
const { getAllAccounts, getAccountById } = require('../controllers/accountController');

const router = express.Router();

router.get('/account', getAllAccounts);
router.get('/account/:id', getAccountById);

module.exports = router;