const { getAllAccounts, getAccountById } = require('../controllers/accountController');

function routes(app) {
    app.get('/account', getAllAccounts);
    app.get('/account/:id', getAccountById);
}

module.exports = {
    routes
};