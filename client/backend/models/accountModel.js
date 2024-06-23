const mongoose = require('mongoose');
const { Schema } = mongoose;

const AccountSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true},
    email: { type: String, required: true},
    password: { type: String, required: true },
    point: { type: Number, required: true },

    order_id: [{
        type: Schema.Types.ObjectId,
        ref: 'Order',
    }],

    isBlock: {
        type: Schema.Types.Boolean,
        required: true,
    },

    vouchers: [{
        voucher_id: { 
            type: Schema.Types.ObjectId, 
            ref: 'Voucher', 
            required: true 
        },
        quantity: { type: Number, required: true }
    }],

    delivery_info: [{
        type: Schema.Types.ObjectId,
        ref: 'DeliveryInfo',
    }]
});

const AccountModel = mongoose.model('Account', AccountSchema);

module.exports = AccountModel;