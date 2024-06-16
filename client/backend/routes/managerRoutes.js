const reportController = require('../controllers/reportController');

function routes(app) {
    app.get('/report/product-sold', reportController.getRevenuePerProduct);
    app.get('/report/revenue', reportController.getDailyRevenue);
    app.get('/report/sales', reportController.getSalesPerDay);
}