const mongoose = require('mongoose');
// const { Schema } = mongoose;

const VoucherSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    required_points: { type: Number, required: true},
    discount: { type: Number, required: true}
});

const VoucherModel = mongoose.model('Voucher', VoucherSchema);

module.exports = VoucherModel;