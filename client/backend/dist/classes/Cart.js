"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Cart {
    constructor() {
        this._productList = new Array;
    }
    get productList() {
        return this._productList;
    }
    addItem(cartItem) {
        var changed = false;
        this._productList.forEach((cartItem1) => {
            if (cartItem1.equals(cartItem)) {
                cartItem1.increase(cartItem.quantity);
                changed = true;
            }
        });
        if (changed)
            return;
        this._productList.push(cartItem);
    }
    removeItem(cartItem) {
        this._productList = this._productList.filter(cartItem1 => !cartItem1.equals(cartItem));
    }
}
exports.default = Cart;
