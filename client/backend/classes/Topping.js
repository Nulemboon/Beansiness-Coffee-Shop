"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Topping {
    constructor(toppingID, name, price, description) {
        this.toppingID = toppingID;
        this.name = name;
        this.price = price;
        this.description = description;
    }

    equals(topping) {
        return this.toppingID == topping.toppingID;
    }
}
exports.default = Topping;
