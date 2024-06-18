const mongoose = require('mongoose');
// const { Schema } = mongoose;

const TransactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now(),
    },
    message: {
        type: String,
        required: true,
    },
    transaction_content: {
        type: String,
    },
    transaction_id: {
        type: String,
        required: true,
    }
});

const TransactionModel = mongoose.model('Transaction', TransactionSchema);

module.exports = TransactionModel;