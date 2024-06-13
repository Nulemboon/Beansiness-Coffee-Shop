class CartItem {
    constructor(product, listTopping, size, quantity) {
        this.product = product;
        this.listTopping = listTopping.sort((a, b) => a.toppingID - b.toppingID);
        this.quantity = quantity;
        this.size = size;
    }

    increase(quantity) {
        this.quantity += quantity;
    }
    decrease(quantity) {
        if (quantity >= this.quantity)
            throw new Error("ERROR: Can not decrease item quantity by: " + quantity);
        this.quantity -= quantity;
    }
    equals(cartItem) {
        // Check if item has equal size
        if (this.size != cartItem.size)
            return false;
        // Check if item has the same topping
        if (this.listTopping.length != cartItem.listTopping.length)
            return false;
        for (var i = 0; i < this.listTopping.length; i++)
            if (this.listTopping[i] != cartItem.listTopping[i])
                return false;
        return this.product.equals(cartItem.product);
    }
}

module.exports = CartItem;