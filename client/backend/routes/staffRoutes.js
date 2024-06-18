const express = require('express');
const staffController = require('../controllers/staffController');

const router = express.Router();

router.get('/:id', staffController.getStaffById);

router.post('/', staffController.addStaff);

router.delete('/:id', staffController.removeStaff);

module.exports = router;