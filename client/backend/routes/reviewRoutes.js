const ReviewController = require('../controllers/reviewController');

const express = require('express');
const router = express.Router();

router.post('/:id', ReviewController.addReview);
router.delete('/:id', ReviewController.removeReview)

module.exports = router;