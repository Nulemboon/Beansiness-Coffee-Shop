const cartController = require('../controllers/cartController');

function routes(app) {
    app.get('/cart', async (req, res) => {
        const cart = await cartController.getCartFromCookies(req, res);
        res.json(cart);
    });

    app.post('/cart/add', cartController.addToCart);
}

module.exports = {
    routes
};