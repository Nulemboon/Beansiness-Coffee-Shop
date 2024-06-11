const express = require('express');
const { getAllUsers, getUserById } = require('../controllers/accountController');

const router = express.Router();

router.get('/account', getAllUsers);
router.get('/account/:id', getAccountById);

module.exports = router;