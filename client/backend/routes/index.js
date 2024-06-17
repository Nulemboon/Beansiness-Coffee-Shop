const accountRouter = require('./accountRoutes');
const cartRouter = require('./cartRoutes');
const deliveryInfoRouter = require('./deliveryInfoRoutes');
const reportRouter = require('./reportRoutes');
const orderRouter = require('./orderRoutes');
const paymentRouter = require('./paymentRoutes');
const productRouter = require('./productRoutes');
const voucherRouter = require('./voucherRoutes');
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

    //Voucher
    app.use('/voucher', voucherRouter);

    //VNPAY
    app.use('/', vnpayRouter);

}

module.exports = route;