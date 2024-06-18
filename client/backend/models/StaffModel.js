const mongoose = require('mongoose');
const { Schema } = mongoose;

const StaffSchema = new mongoose.Schema({
    account_id: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    role: {
        type: String,
        required: true,
    }
});

const StaffModel = mongoose.model('Staff', StaffSchema);

module.exports = StaffModel;