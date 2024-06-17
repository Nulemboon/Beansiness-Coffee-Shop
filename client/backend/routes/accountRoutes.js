const { getAllAccounts, getAccountById, getOrderHistory } = require('../controllers/accountController');

function routes(app) {
    app.get('/account', getAllAccounts);
    app.get('/account/:id', getAccountById);
    app.get('/account/orders/:id', getOrderHistory);
}

module.exports = {
    routes
};