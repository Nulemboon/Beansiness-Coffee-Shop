const ProductModel = require('../models/ProductModel');
const ToppingModel = require('../models/ToppingModel');

class CartController {
    async addToCart(req, res) {
        try {
            const { productId, quantity, size, toppings } = req.body;
            let cart = req.cookies.cart || [];

            // Validate product
            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(204).json({ message: `Product not found: ${productId}` });
                return;
            }

            // Validate toppings
            const validatedToppings = [];
            for (const toppingId of toppings) {
                const topping = await ToppingModel.findById(toppingId);
                if (!topping) {
                    res.status(204).json({ message: `Topping not found: ${toppingId}` });
                    return;
                }
                validatedToppings.push(toppingId);
            }

            // Check if the item already exists in the cart
            const existingItemIndex = cart.findIndex(
                (item) =>
                    item.product_id === productId &&
                    item.size === size &&
                    item.toppings.sort().toString() === validatedToppings.sort().toString()
            );

            if (existingItemIndex !== -1) {
                // Update quantity if item exists
                cart[existingItemIndex].quantity += quantity;
            } else {
                // Add new item to cart
                cart.push({ productId, quantity, size, toppings: validatedToppings });
            }

            // Update cart cookie
            res.cookie('cart', cart, { httpOnly: true });
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while adding to the cart: ' + error.message});
        }
    }

    async decreaseCartItem(req, res) {
        try {
            const { productId, size, toppings } = req.body;
            let cart = req.cookies.cart || [];

            // Validate product
            const product = await ProductModel.findById(productId);
            if (!product) {
                res.status(204).json({ message: `Product not found: ${productId}` });
                return;
            }

            // Validate toppings
            const validatedToppings = [];
            for (const toppingId of toppings) {
                const topping = await ToppingModel.findById(toppingId);
                if (!topping) {
                    res.status(204).json({ message: `Topping not found: ${toppingId}` });
                    return;
                }
                validatedToppings.push(toppingId);
            }

            // Check if the item already exists in the cart
            const existingItemIndex = cart.findIndex(
                (item) =>
                    item.product_id === productId &&
                    item.size === size &&
                    item.toppings.sort().toString() === validatedToppings.sort().toString()
            );

            if (existingItemIndex !== -1) {
                if (cart[existingItemIndex].quantity == 1) {
                    res.status(204).json({ message: `Can not reduce item below 1` });
                    return;
                }
                
                // Update quantity if item exists
                cart[existingItemIndex].quantity -= 1;
            } else {
                res.status(204).json({ message: `Cart item not found` });
                return;
            }

            // Update cart cookie
            res.cookie('cart', cart, { httpOnly: true });
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while adding to the cart: ' + error.message});
        }
    }

    async removeFromCart(req, res) {
        try {
            const { productId, size, toppings } = req.body;
            let cart = req.cookies.cart || [];

            // Check if the item exists in the cart
            const itemIndex = cart.findIndex(
                (item) =>
                    item.product_id === productId &&
                    item.size === size &&
                    item.toppings.sort().toString() === toppings.sort().toString()
            );

            if (itemIndex === -1) {
                res.status(400).json({ message: `Item not found in cart: ${productId}` });
                return;
            }

            // Remove item from cart
            cart.splice(itemIndex, 1);

            // Update cart cookie
            res.cookie('cart', cart, { httpOnly: true });
            res.status(200).json({ message: `Item removed from cart: ${productId}`});
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while removing from the cart: ' + error.message});
        }
    }

    async checkCart(req, res) {
        try {
            const cart = req.cookies.cart;

            if (!cart || cart.length === 0) {
                res.status(400).json({ message: 'Cart is empty' });
                return;
            }

            const validatedCart = [];

            for (const item of cart) {
                const product = await ProductModel.findById(item.product_id);

                if (!product) {
                    res.status(204).json({ message: `Product not found: ${item.product_id}` });
                    return;
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
            res.status(500).json({ error: 'An error occurred while checking the cart: ' + error.message});
        }
    }

    async getCart(req, res) {
        try {
            const cart = req.cookies.cart || [];
            res.status(200).json({ cart });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while retrieving the cart: ' + error.message});
        }
    }

    async getTotalAmount(req, res) {
        try {
            const cart = req.cookies.cart;
            
            // If cart empty, return 0
            if (!cart || cart.length === 0) {
                res.status(200).json(0);
                return;
            }

            var totalPrice = 0;

            for (const item of cart) {
                var priceProduct = 0;
                const product = await ProductModel.findById(item.product_id);
                
                // Check if product exist
                if (!product) {
                    res.status(204).json({ message: `Product not found: ${item.product_id}` });
                    return;
                }

                priceProduct += product.price;

                // Get list of topping
                for (const toppingId of item.toppings) {
                    const topping = await ToppingModel.findById(toppingId);
                    priceProduct += topping.price;
                }

                totalPrice += priceProduct * item.quantity;
            }

            res.status(200).json(totalPrice);

        } catch (error) {
            res.status(500).json({ error: 'An error occurred while calculating cart: ' + error.message});
        }
    }

}
module.exports = new CartController();