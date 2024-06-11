"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CartItem {
    constructor(product, listTopping, size, quantity) {
        this._product = product;
        this._listTopping = listTopping.sort((a, b) => a.toppingID - b.toppingID);
        this._quantity = quantity;
        this._size = size;
    }
    get product() {
        return this._product;
    }
    get listTopping() {
        return this._listTopping;
    }
    get quantity() {
        return this._quantity;
    }
    get size() {
        return this._size;
    }
    increase(quantity) {
        this._quantity += quantity;
    }
    decrease(quantity) {
        if (quantity >= this._quantity)
            throw new Error("ERROR: Can not decrease item quantity by: " + quantity);
        this._quantity -= quantity;
    }
    equals(cartItem) {
        // Check if item has equal size
        if (this._size != cartItem.size)
            return false;
        // Check if item has the same topping
        if (this._listTopping.length != cartItem.listTopping.length)
            return false;
        for (var i = 0; i < this._listTopping.length; i++)
            if (this._listTopping[i] != cartItem.listTopping[i])
                return false;
        return this.product.equals(cartItem.product);
    }
}
exports.default = CartItem;
