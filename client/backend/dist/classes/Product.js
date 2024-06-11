"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Product {
    constructor(productID, name, description, price) {
        this._productID = productID;
        this._name = name;
        this._description = description;
        this._price = price;
    }
    get productID() {
        return this._productID;
    }
    equals(product) {
        return this.productID == product.productID;
    }
}
exports.default = Product;
