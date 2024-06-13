const CartItem = require("./CartItem");

class Cart {
    constructor(productList) {
        this.productList = productList;
    }

    addItem(cartItem) {
        var changed = false;
        this.productList.forEach((cartItem1) => {
            if (cartItem1.equals(cartItem)) {
                cartItem1.increase(cartItem.quantity);
                changed = true;
            }
        });
        if (changed)
            return;
        this.productList.push(cartItem);
    }
    
    removeItem(cartItem) {
        this.productList = this.productList.filter(cartItem1 => !cartItem1.equals(cartItem));
    }
}

module.exports = Cart;
