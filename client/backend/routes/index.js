const express = require('express');

const accountRouter = require('./accountRoutes');
const cartRouter = require('./cartRoutes');
const deliveryInfoRouter = require('./deliveryInfoRoutes');
const reportRouter = require('./reportRoutes');
const orderRouter = require('./orderRoutes');
const paymentRouter = require('./paymentRoutes');
const productRouter = require('./productRoutes');
const voucherRouter = require('./voucherRoutes');
const staffRouter  = require('./staffRoutes');
const vnpayRouter = require('../subsystem/vnpayRoutes');

function route(app) {
    //Account
    app.use('/account', accountRouter);

    //Cart
    app.use('/cart', cartRouter);
    // app.post('/cart', cartRouter);
    // app.delete('/cart', cartRouter);

    //Delivery Info
    app.use('/deliveryInfo', deliveryInfoRouter);
    // app.post('/deliveryInfo', deliveryInfoRouter);

    //Report
    app.use('/report', reportRouter);

    //Order
    app.use('/order', orderRouter);

    //Payment
    app.use('/payment', paymentRouter);

    //Product
    app.use('/product', productRouter);

    app.use("/images", express.static('uploads'))

    //Voucher
    app.use('/voucher', voucherRouter);

    //Staff
    app.use('/staff', staffRouter);

    //VNPAY
    app.use('/transaction', vnpayRouter);

    app.use('/:slug', (req, res) => {
        res.send('Path not found');
    })
    
    app.use('/', (req, res) => {
        res.send("API Working")
    });
}

module.exports = route;