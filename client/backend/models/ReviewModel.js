const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new mongoose.Schema({
    review: { type: String, required: true},
    rating: { type: Number, required: true},

    account_id: {
        type: Schema.ObjectId,
        required: true,
    },

});

const ReviewModel = mongoose.model('Review', ReviewSchema);

module.exports = ReviewModel;