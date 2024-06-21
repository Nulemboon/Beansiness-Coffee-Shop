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
const sampleData = require('./sample.json');
const DeliveryInfoModel = require('../models/DeliveryInfoModel');

async function insertSampleData() {
    try {
        await mongoose.connect('mongodb+srv://tri2003714:8825529tT@cluster0.tq9x0ib.mongodb.net/').then(()=>console.log("DB Connected"))

        await AccountModel.deleteMany({});
        await ProductModel.deleteMany({});
        await ToppingModel.deleteMany({});
        await OrderItemModel.deleteMany({});
        await DeliveryInfoModel.deleteMany({});
        await OrderModel.deleteMany({});
        await TransactionModel.deleteMany({});
        await VoucherModel.deleteMany({});
        await StaffModel.deleteMany({});
        await ReviewModel.deleteMany({});

        const salt = 10;

        const vouchers = sampleData.vouchers;
        const savedVouchers = await VoucherModel.insertMany(vouchers);

        const delivery = sampleData.delivery_info;
        const savedDelivery = await DeliveryInfoModel.insertMany(delivery);

        const accounts = sampleData.accounts;
        const newAccounts = [];
        for (account in accounts) {
            const hashedPassword = await bcrypt.hash("abc123", salt);
            newAccounts.push({
                name: account.name,
                phone: account.phone,
                email: account.email,
                password: hashedPassword,
                point: account.points,
                isBlock: account.isBlock
            });
        }

        const savedAccounts = await AccountModel.insertMany(newAccounts);
        await savedAccounts.save();
        
        savedAccounts[4].vouchers.push({
            voucher_id: savedVouchers[0]._id,
            quantity: 10
        },
        {
            voucher_id: savedVouchers[1]._id,
            quantity: 10
        },
        {
            voucher_id: savedVouchers[2]._id,
            quantity: 10
        },
        {
            voucher_id: savedVouchers[3]._id,
            quantity: 10
        },
        {
            voucher_id: savedVouchers[4]._id,
            quantity: 10
        },
        );

        savedAccounts[4].delivery_info.push({
            delivery_id: savedDelivery[1]._id,
        },
        {
            delivery_id: savedDelivery[3]._id,
        }
        )

        await savedAccounts[4].save();

        savedAccounts[3].vouchers.push({
            voucher_id: savedVouchers[0]._id,
            quantity: 1
        },
        {
            voucher_id: savedVouchers[1]._id,
            quantity: 1
        },
        {
            voucher_id: savedVouchers[2]._id,
            quantity: 1
        },
        {
            voucher_id: savedVouchers[3]._id,
            quantity: 1
        },
        {
            voucher_id: savedVouchers[4]._id,
            quantity: 1
        },
        );

        savedAccounts[3].delivery_info.push({
            delivery_id: savedDelivery[0]._id,
        },
        {
            delivery_id: savedDelivery[2]._id,
        }
        )

        await savedAccounts[3].save();

        const toppings = sampleData.toppings;
        const savedToppings = await ToppingModel.insertMany(toppings);
        
        const products = sampleData.products;
        const savedProducts = await ProductModel.insertMany(products);

        savedProducts[0].availale_toppings.push(savedToppings[0]);
        await savedProducts[0].save();

        savedProducts[1].availale_toppings.push(savedToppings[0]);
        await savedProducts[1].save();

        savedProducts[2].availale_toppings.push(savedToppings[0]);
        await savedProducts[2].save();
        savedProducts[3].availale_toppings.push(savedToppings[0]);
        await savedProducts[3].save();
        savedProducts[4].availale_toppings.push(savedToppings[2], savedToppings[3], savedToppings[4]);
        await savedProducts[4].save();
        savedProducts[5].availale_toppings.push(savedToppings[2], savedToppings[3], savedToppings[4]);
        await savedProducts[5].save();
        savedProducts[6].availale_toppings.push(savedToppings[2], savedToppings[3], savedToppings[4]);
        await savedProducts[6].save();
        savedProducts[7].availale_toppings.push(savedToppings[1], savedToppings[2], savedToppings[3], savedToppings[4]);
        await savedProducts[7].save();
        savedProducts[8].availale_toppings.push(savedToppings[1], savedToppings[2], savedToppings[3], savedToppings[4]);
        await savedProducts[8].save();
    } catch (error) {
        console.error('Error inserting sample data:', error);
    } finally {
        mongoose.connection.close();
    }
    
}

insertSampleData();
