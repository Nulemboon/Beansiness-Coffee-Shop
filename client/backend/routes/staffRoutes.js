const express = require('express');
const staffController = require('../controllers/staffController');

const router = express.Router();

router.get('/:id', staffController.getStaffById);

router.get('/', staffController.getAllStaff);

router.post('/', staffController.addStaff);

router.delete('/:id', staffController.removeStaff);

router.put('/:id', staffController.updateStaff);

module.exports = router;