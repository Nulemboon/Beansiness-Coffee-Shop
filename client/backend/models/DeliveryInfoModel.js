const mongoose = require('mongoose');

const DeliveryInfoSchema = new mongoose.Schema({
    receiver_name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    phone_number: {
        type: String,
        required: true
    },

    instruction: {
        type: String,
    },
});

const DeliveryInfoModel = mongoose.model('DeliveryInfo', DeliveryInfoSchema);

module.exports = DeliveryInfoModel;
