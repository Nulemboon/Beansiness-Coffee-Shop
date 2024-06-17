const express = require('express');
const accountController = require('../controllers/accountController');

const router = express.Router();

router.get('/:id', accountController.getAccountById);

router.get('/', accountController.getAllAccounts);



module.exports = router;