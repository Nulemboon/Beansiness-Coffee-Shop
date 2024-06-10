import Cart from "./Cart";
import DeliveryInfo from "./DeliveryInfo";

class Order {
    private _orderID: Number;
    private _cart: Cart;
    private _deliveryInfo: DeliveryInfo;
    private _shippingFee: Number;
    private _status: String;

    constructor(cart: Cart, deliveryInfo: DeliveryInfo, shippingFee: Number, status: String) {
        this._cart = cart;
        this._deliveryInfo = deliveryInfo;
        this._shippingFee = shippingFee;
        this._status = status;
    }
}

export default Order;