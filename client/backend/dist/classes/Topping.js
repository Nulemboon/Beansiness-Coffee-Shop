"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Topping {
    constructor(toppingID, name, price, description) {
        this._toppingID = toppingID;
        this._name = name;
        this._price = price;
        this._description = description;
    }
    get toppingID() {
        return this._toppingID;
    }
    equals(topping) {
        return this._toppingID == topping.toppingID;
    }
}
exports.default = Topping;
