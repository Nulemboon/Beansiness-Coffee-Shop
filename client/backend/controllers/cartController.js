const Cart = require('../classes/Cart');
const CartItem = require('../classes/CartItem');

class CartController {
    /**
    * Load and return `Cart Object` from cookies
    */
    getCartFromCookies = async (req, res) => {
        let cartJson = req.cookies.cart;
        if (!cartJson) {
            // If not exist then create an empty cart
            const newCart = new Cart([]);
            saveCartToCookies(req, res, newCart);
            cartJson = JSON.stringify(newCart);
        }
        const cartObj = JSON.parse(cartJson);
        return cartObj;
    }

    saveCartToCookies = async (req, res, cart) => {
        res.cookie('cart', JSON.stringify(cart));
    };


    updateCart = async (req, res) => {
        try {
            const { product, listTopping, size, quantity } = req.body;
            const cartItem = new CartItem(product, listTopping, size, quantity);

            // Get cart
            const cartObj = getCartFromCookies(req, res);
            // Convert to cart Class to add item
            let cartClass = new Cart(cartObj.productList);
            cartClass.updateCart(cartItem);

            // Save to cookies
            saveCartToCookies(req, res, cartClass);
            res.status(200).json(req.body);

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

    removeFromCart = async (req, res) => {
        try {
            const { product, listTopping, size, quantity } = req.body;
            const cartItem = new CartItem(product, listTopping, size, quantity);

            // Get cart
            const cartObj = getCartFromCookies(req, res);
            // Convert to cart Class to add item
            let cartClass = new Cart(cartObj.productList);
            cartClass.removeItem(cartItem);

            // Save to cookies
            saveCartToCookies(req, res, cartClass);
            res.status(200).json(req.body);

        } catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }

}
module.exports = new CartController();