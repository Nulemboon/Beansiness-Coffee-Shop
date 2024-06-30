import React, { useContext, useState, useEffect } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import AddToCartModal from '../AddToCartModal/AddToCartModal';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';
import axios from 'axios';

const FoodItem = ({ image, name, price, desc, id, toppings, onClick }) => {
    const { cartItems, addToCart, url, token, setCartItems } = useContext(StoreContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cookies, setCookie] = useCookies(['cart']);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const response = await axios.get(`${url}/product`);
                const product = response.data.find(item => item._id === id);

                if (product && product.reviews && product.reviews.length > 0) {
                    const avgRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;
                    setAverageRating(avgRating.toFixed(1));
                } else {
                    setAverageRating(0);
                }
            } catch (error) {
                console.error('Error fetching product rating:', error);
            }
        };

        fetchRating();
    }, [id, url]);

    const handleAddToCartClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (!token) {
            toast.error('Please sign in first to add items to your cart.', {
                position: 'top-right',
                autoClose: 3000
            });
            return;
        }

        setIsModalOpen(true);
    };

    const handleAddToCart = (quantity, size, selectedToppings, totalPrice) => {
        const currentCart = cookies.cart || [];
        const productKey = `${id}_${size}_${selectedToppings.map(t => t._id).join('_')}`;
        const productIndex = currentCart.findIndex(item => item.key === productKey);

        if (productIndex > -1) {
            currentCart[productIndex].quantity += quantity;
        } else {
            const product = {
                key: productKey,
                _id: id,
                name: name,
                price: totalPrice,
                quantity: quantity,
                size: size,
                toppings: selectedToppings,
            };
            currentCart.push(product);
        }

        setCookie('cart', currentCart, { path: '/' });
        addToCart(id, quantity, size, selectedToppings);
        setIsModalOpen(false);
    };

    const handleRemoveFromCartClick = (e) => {
        e.stopPropagation();

        const currentCart = cookies.cart || [];
        const productKey = `${id}_${cartItems[id]?.size}_${cartItems[id]?.toppings?.map(t => t._id).join('_')}`;

        const productIndex = currentCart.findIndex(item => item.key === productKey);

        if (productIndex > -1) {
            if (currentCart[productIndex].quantity > 1) {
                currentCart[productIndex].quantity -= 1;
            } else {
                currentCart.splice(productIndex, 1);
            }
        }

        setCookie('cart', currentCart, { path: '/' });

        setCartItems((prev) => {
            const updatedCart = { ...prev };
            if (updatedCart[id]?.quantity > 1) {
                updatedCart[id].quantity -= 1;
            } else {
                delete updatedCart[id];
            }
            return updatedCart;
        });
    };

    return (
        <div className='food-item' onClick={onClick}>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />
                {!cartItems[id] ? (
                    <img
                        className='add'
                        onClick={handleAddToCartClick}
                        src={assets.add_icon_white}
                        alt="Add to cart"
                    />
                ) : (
                    <div className="food-item-counter">
                        <img src={assets.remove_icon_red} onClick={handleRemoveFromCartClick} alt="Remove from cart" />
                        <p>{cartItems[id]?.quantity || 0}</p>
                        <img src={assets.add_icon_green} onClick={handleAddToCartClick} alt="Add more to cart" />
                    </div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p> <span className="food-item-rating">⭐ {averageRating}</span>
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">{price.toLocaleString('en-US', { style: 'currency', currency: 'VND' })}</p>
            </div>
            <AddToCartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddToCart={handleAddToCart}
                toppings={toppings}
                price={price}
            />
        </div>
    );
};

export default FoodItem;
