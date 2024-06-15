const orderController = require('../controllers/orderController');

function routes(app) {
    app.get('/vieworder', orderController.getCurrentOrders);
}

module.exports = {
    routes,
}