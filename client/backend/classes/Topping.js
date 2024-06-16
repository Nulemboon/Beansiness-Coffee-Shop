class Topping {
    constructor(toppingID, name, price) {
        this.toppingID = toppingID;
        this.name = name;
        this.price = price;
    }

    equals(topping) {
        return this.toppingID == topping.toppingID;
    }
}

module.exports = Topping;
