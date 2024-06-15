const deliveryFromControler = require('../controllers/deliveryFormController');

function routes(app) {
    app.get('/delivery_form', async (req, res) => {
        const deliveryInfo = await deliveryFromControler.getDeliveryInfo(req, res);
        res.json(deliveryInfo);
    })

    app.post('/delivery_from', deliveryFromControler.submitDeliveryInfo);
}

module.exports = {
    routes
};