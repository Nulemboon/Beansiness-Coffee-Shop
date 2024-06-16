const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    // Delivery form
    delivery_info: {
        type: Schema.Types.ObjectId,
        ref: 'DeliveryInfo',
        required: true
    },

    // Cart
    order_items: [{
        type: Schema.Types.ObjectId,
        ref: 'OrderItem'
    }],

    // Shipping fee
    shipping_fee: {
        type: Number,
        required: true
    },

    // Order status
    status: {
        type: String,
        required: true
    },

    // Completed data
    completed_at: {
        type: Date,
        default: Date.now
    },    
})

const OrderModel = mongoose.model('Order', OrderSchema);

module.exports = OrderModel;