import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import './Cart.css';
import { useNavigate, Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { StoreContext } from '../../Context/StoreContext';

const Cart = () => {
    const navigate = useNavigate();
    const { url } = useContext(StoreContext);
    const [cart, setCart] = useState([]);
    const [cookies, setCookie] = useCookies(['cart', 'voucher_id']);
    const [vouchers, setVouchers] = useState([]);
    const [selectedVoucher, setSelectedVoucher] = useState(null);

    useEffect(() => {
        const currentCart = cookies.cart || [];
        setCart(currentCart);
        const savedVoucher = vouchers.find(v => v._id === cookies.voucher_id);
        setSelectedVoucher(savedVoucher || null);
    }, [cookies.cart, cookies.voucher_id, vouchers]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get(`${url}/account/current`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // assuming token is stored in localStorage
                    },
                });
                setVouchers(response.data.vouchers.map(v => v.voucher_id));
            } catch (error) {
                console.error('Failed to fetch vouchers:', error);
            }
        };

        fetchVouchers();
    }, [url]);

    const handleRemoveFromCart = (itemIndex) => {
        const updatedCart = cart.filter((_, index) => index !== itemIndex);
        setCart(updatedCart);
        setCookie('cart', updatedCart, { path: '/' });
    };

    const handleCheckout = () => {
        const totalPrice = Math.max(20000, getTotalPrice() + 20000 - (selectedVoucher ? selectedVoucher.discount : 0));
        if (cart.length > 0) { // Ensure total price is more than the delivery fee
            setCookie('cart', cart, { path: '/' });
            setCookie('voucher_id', selectedVoucher ? selectedVoucher._id : '', { path: '/' });
            navigate('/deliveryform', { state: { amount: totalPrice, voucherCode: selectedVoucher ? selectedVoucher.name : '' } });
        } else {
            alert('Your cart is empty!');
        }
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => {
            const toppingCost = (item.toppings || []).reduce((sum, topping) => {
                return sum + (topping.price || 0);
            }, 0);
            return total + (item.price + toppingCost) * item.quantity;
        }, 0);
    };

    if (!cart.length) {
        return (
            <div>
                <p>Your cart is empty.</p>
                <Link to="/menupage" style={{ color: 'brown' }}>Explore our menu</Link>
            </div>
        );
    }

    return (
        <div className='cart'>
            <div className="cart-items">
                <div className="cart-items-title">
                    <p>Title</p>
                    <p>Size</p>
                    <p>Toppings</p>
                    <p>Price</p>
                    <p>Quantity</p>
                    <p>Total</p>
                    <p>Remove</p>
                </div>
                <br />
                <hr />
                {cart.map((item, index) => (
                    <div key={index}>
                        <div className="cart-items-title cart-items-item">
                            <p>{item.name}</p>
                            <p>{item.size}</p>
                            <p>{(item.toppings || []).map(topping => topping.name).join(', ')}</p>
                            <p>{item.price} VND</p>
                            <div>{item.quantity}</div>
                            <p>{(item.price + (item.toppings || []).reduce((sum, topping) => sum + (topping.price || 0), 0)) * item.quantity} VND</p>
                            <p className='cart-items-remove-icon' onClick={() => handleRemoveFromCart(index)}>x</p>
                        </div>
                        <hr />
                    </div>
                ))}
            </div>
            <div className="cart-bottom">
                <div className="cart-total">
                    <h2 style={{ color: '#8B4513' }}>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>{getTotalPrice()} VND</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>{getTotalPrice() === 0 ? 0 : 20000} VND</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Voucher</p><p>{selectedVoucher ? `${selectedVoucher.name} (-${selectedVoucher.discount} VND)` : 'No Voucher'}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>{getTotalPrice() === 0 ? 0 : Math.max(20000, getTotalPrice() + 20000 - (selectedVoucher ? selectedVoucher.discount : 0))} VND</b></div>
                        <div> <p style={{ fontStyle: 'italic' }}>The minimum order amount is 20.000VND</p></div>
                    </div>
                    <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
                </div>
                <div className="cart-promocode">
                    <div>
                        <p>If you have a voucher, select it here</p>
                        <div className='cart-promocode-select'>
                            <select
                                value={selectedVoucher ? selectedVoucher._id : ''}
                                onChange={(e) => {
                                    const selected = vouchers.find(v => v._id === e.target.value);
                                    setSelectedVoucher(selected);
                                }}
                            >
                                <option value=''>Select a voucher</option>
                                {vouchers.map(voucher => (
                                    <option key={voucher._id} value={voucher._id}>
                                        {voucher.name} ({voucher.discount} VND off)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;
