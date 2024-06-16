class Order {
    constructor(cart, deliveryInfo, shippingFee, status) {
        this.cart = cart;
        this.deliveryInfo = deliveryInfo;
        this.shippingFee = shippingFee;
        this.status = status;
        this.date = ""
    }
}

module.exports = Order;
