"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Order {
    constructor(orderID, cart, deliveryInfo, shippingFee, status) {
        this._orderID = orderID;
        this._cart = cart;
        this._deliveryInfo = deliveryInfo;
        this._shippingFee = shippingFee;
        this._status = status;
    }
}
exports.default = Order;
