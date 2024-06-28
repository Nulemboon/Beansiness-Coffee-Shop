const CartItem = require("./CartItem");

class Cart {
    constructor(productList = []) {
        this.productList = productList.map(item => 
            new CartItem(item.product, item.listTopping, item.size, item.quantity)
        );
        this.cartPrice = this.calculateCartPrice();
    }

    updateCart(newItem) {
        let changed = false;
        
        // Find and update the item if it exists in the cart
        this.productList.forEach((cartItem) => {
            if (cartItem.equals(newItem)) {
                cartItem.updateQuantity(newItem.quantity);
                changed = true;
            }
        });

        // If item was not found in the cart, add it as a new CartItem
        if (!changed) {
            this.productList.push(new CartItem(
                newItem.product, 
                newItem.listTopping, 
                newItem.size, 
                newItem.quantity
            ));
        }
    }

    removeItem(cartItemToRemove) {
        this.productList = this.productList.filter(cartItem => 
            !cartItem.equals(cartItemToRemove)
        );
    }

    calculateCartPrice() {
        let price = 0.0;

        this.productList.forEach((cartItem) => {
            let itemPrice = cartItem.product.price;

            cartItem.listTopping.forEach((topping) => {
                itemPrice += topping.price;
            });

            itemPrice += ((cartItem.size === 'L') ? 10000 : 0);
            itemPrice += ((cartItem.size === 'M') ? 5000 : 0);

            price += itemPrice * cartItem.quantity;
        });

        return price;
    }
}

module.exports = Cart;
