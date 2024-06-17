const ProductModel = require('../models/ProductModel');
const ToppingModel = require('../models/ToppingModel');

class CartController {

    async addToCart(req, res) {
        try {
            const { product_id, quantity, size, toppings } = req.body;
            let cart = req.cookies.cart || [];

            // Validate product
            const product = await ProductModel.findById(product_id);
            if (!product) {
                return res.status(400).json({ message: `Product not found: ${product_id}` });
            }

            // Validate toppings
            const validatedToppings = [];
            for (const topping_id of toppings) {
                const topping = await ToppingModel.findById(topping_id);
                if (!topping) {
                    return res.status(400).json({ message: `Topping not found: ${topping_id}` });
                }
                validatedToppings.push(topping_id);
            }

            // Check if the item already exists in the cart
            const existingItemIndex = cart.findIndex(
                (item) =>
                    item.product_id === product_id &&
                    item.size === size &&
                    item.toppings.sort().toString() === validatedToppings.sort().toString()
            );

            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                cart[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.push({ product_id, quantity, size, toppings: validatedToppings });
            }

            // Update cart cookie
            res.cookie('cart', cart, { httpOnly: true });
            res.status(200).json({ message: 'Item added to cart', cart });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'An error occurred while adding to the cart' });
        }
    }

    async removeFromCart(req, res) {
        try {
            const { product_id, size, toppings } = req.body;
            let cart = req.cookies.cart || [];

            // Check if the item exists in the cart
            const itemIndex = cart.findIndex(
                (item) =>
                    item.product_id === product_id &&
                    item.size === size &&
                    item.toppings.sort().toString() === toppings.sort().toString()
            );

            if (itemIndex === -1) {
                return res.status(400).json({ message: 'Item not found in cart' });
            }

            // Remove item from cart
            cart.splice(itemIndex, 1);

            // Update cart cookie
            res.cookie('cart', cart, { httpOnly: true });
            res.status(200).json({ message: 'Item removed from cart', cart });
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).json({ message: 'An error occurred while removing from the cart' });
        }
    }

    async checkCart(req, res) {
        try {
            const cart = req.cookies.cart;

            if (!cart || cart.length === 0) {
                return res.status(400).json({ message: 'Cart is empty' });
            }

            const validatedCart = [];

            for (const item of cart) {
                const product = await ProductModel.findById(item.product_id);

                if (!product) {
                    return res.status(400).json({ message: `Product not found: ${item.product_id}` });
                }

                validatedCart.push({
                    product_id: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: item.quantity,
                    available_toppings: item.toppings,
                });
            }

            res.status(200).json({ cart: validatedCart });
        } catch (error) {
            console.error('Error checking cart:', error);
            res.status(500).json({ message: 'An error occurred while checking the cart' });
        }
    }

    async getCart(req, res) {
        try {
            const cart = req.cookies.cart || [];
            res.status(200).json({ cart });
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json({ message: 'An error occurred while retrieving the cart' });
        }
    }

}
module.exports = new CartController();