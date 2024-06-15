"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Product {
    constructor(productID, name, description, price) {
        this.productID = productID;
        this.name = name;
        this.description = description;
        this.price = price;
    }
    
    equals(product) {
        return this.productID == product.productID;
    }
}
exports.default = Product;
