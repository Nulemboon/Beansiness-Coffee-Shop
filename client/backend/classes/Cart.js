const CartItem = require("./CartItem");

class Cart {
    constructor(productList) {
        this.productList = productList;
        this.cartPrice = this.calculateCartPrice();
    }

    /**This function will include:
     * 
     * - Add item to cart if not exists
     * 
     * - Modify cartItem quantity base on `quantity` of passed cartItem
     */
    updateCart(cartItem) {
        var changed = false;
        this.productList.forEach((cartItem1) => {
            if (cartItem1.equals(cartItem)) {
                cartItem1.updateQuantity(cartItem.quantity);
                changed = true;
            }
        });
        
        // Changed is true when the cart is modified
        if (changed)
            return;

        this.productList.push(cartItem);
    }
    
    /** Remove product from cart */
    removeItem(cartItem) {
        this.productList = this.productList.filter(cartItem1 => !cartItem1.equals(cartItem));
    }

    /** Calcuate total price of cart */
    calculateCartPrice() {
        var price = 0.0;

        // Loop through every product item
        this.productList.forEach((cartItem) => {
            itemPrice = cartItem.product.price;

            // Take topping price
            cartItem.listTopping.forEach((topping) => {
                itemPrice += topping.price;
            })

            // Calculate price based on size
            itemPrice += ((cartItem.size == 'L') ? 10000 : 0);
            itemPrice += ((cartItem.size == 'M') ? 5000 : 0);

            // Update total price
            price += itemPrice * cartItem.quantity;
        });

        return price;
    }
}

module.exports = Cart;
