const mongoose = require('mongoose');
const AccountModel = require('../models/AccountModel');
const ProductModel = require('../models/ProductModel');
const ToppingModel = require('../models/ToppingModel');
const OrderModel = require('../models/OrderModel');
const OrderItemModel = require('../models/OrderItemModel');
const TransactionModel = require('../models/TransactionModel');
const VoucherModel = require('../models/VoucherModel');
const ReviewModel = require('../models/ReviewModel');
const StaffModel = require('../models/StaffModel');
const bcrypt = require('bcrypt');
// const sampleData = require('./sample.json');

async function insertSampleData() {
    await mongoose.connect('mongodb+srv://tri2003714:8825529tT@cluster0.tq9x0ib.mongodb.net/').then(()=>console.log("DB Connected"))
    const password = 'abc123';
    const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAccount = AccountModel({
        name: 'admin',
        phone: '1234567890',
        email: 'tri2003714@gmail.com',
        password: hashedPassword,
        point: 0,
        order_id: [],
        isBlock: false,
        vouchers: []
    });

    const savedAccount = await newAccount.save();

    const newStaff = StaffModel({
        account_id: savedAccount._id,
        role: 'admin'
    });

    const savedStaff = await newStaff.save();

    console.log('Sample data inserted successfully!');
    mongoose.connection.close();
}

insertSampleData().catch(err => console.error(err));
