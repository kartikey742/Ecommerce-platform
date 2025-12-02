
    import { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom'; // Assuming you use React Router for navigation
    import { Loader } from '../components/common/Loader'; // Re-using our loader
    import { useSelector } from 'react-redux';
    import { toast } from 'react-toastify';
    import { useNavigate } from 'react-router-dom';
    export const Cart = ({isCheckout,setCart,cart,handleInitiateRazorpayPayment}) => {
        
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const {user}=useSelector((state)=>state.auth)
        const userId = user?.id;
        const navigate=useNavigate();
        useEffect(() => {
            const fetchCartData = async () => {
                try {
                    setLoading(true);
                    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/shop/cart/get/${userId}`);
                    const data = await res.json();
                    console.log(data.data);
                    if (data.success) {
                        
                        setCart(data.data);
                       
                        
                        
                    } else {
                        // If cart is not found (404), it's not an error, just an empty cart.
                        if (res.status === 404) {
                            setCart({ items: [] });
                        } else {
                            setError(data.message);
                        }
                    }
                } catch (err) {
                    setError("Failed to fetch cart. Please try again later.");
                } finally {
                    setLoading(false);
                }
            };
            
            fetchCartData();
        }, [userId]);   
        
        const handleUpdateQuantity = async (productId, quantity,totalStock) => {
            // Prevent updates to 0 or less from the UI
            if (quantity < 1) return;
            if(quantity>totalStock){
                toast.error("Sorry we are out of stock")
                return
            }
            // Optimistic UI update for a smooth experience
            const originalCart = { ...cart };
            const updatedItems = cart.items.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            );
            setCart({ ...cart, items: updatedItems });

            try {
                await fetch(`${process.env.REACT_APP_BASE_URL}/shop/cart/update-cart`, {
                    method: 'PUT', // Assuming you set up a PUT route for this
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, productId, quantity }),
                });
            } catch (err) {
                // Revert on error
                setCart(originalCart);
                alert("Failed to update quantity.");
            }
        };
        
        const handleRemoveItem = async (productId) => {
            const originalCart = { ...cart };
            const updatedItems = cart.items.filter(item => item.productId !== productId);
            setCart({ ...cart, items: updatedItems });

            try {
                await fetch(`${process.env.REACT_APP_BASE_URL}/shop/cart/${userId}/${productId}`, {
                    method: 'DELETE',
                });
            } catch (err) {
                setCart(originalCart);
                console.log(err);
                ;
            }
        };

        const subtotal = cart?.items.reduce((acc, item) => {
            const price = item.salePrice > 0 ? item.salePrice : item.price;
            return acc + price * item.quantity;
        }, 0) ?? 0;

        const tax = subtotal * 0.18; // Example 18% tax
        const shipping = subtotal+tax > 500 ? 0 : 50; // Example free shipping over 500
        const total = subtotal + tax + shipping;

        if (loading) {
            return <Loader />;
        }

        if (error) {
            return <div className="cart-error">Error: {error}</div>;
        }

        if (!cart || cart.items.length === 0) {
            return (
                <div className="cart-container empty-cart">
                    <h2>Your Cart is Empty</h2>
                    <p>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/shop/listing" className="btn-primary">Continue Shopping</Link>
                </div>
            );
        }
        console.log(cart);
        const handleCheckout = () => {
            if (isCheckout) {
            console.log('hi');
            
               handleInitiateRazorpayPayment()
            } else {
                // Proceed to checkout
                navigate('/shop/checkout');
            }
        };
        return (
            <div className="cart-container">
            {!isCheckout && <h1 className="cart-header">Your Shopping Cart</h1>}
                <div className="cart-layout" style={{flexDirection:isCheckout?'column':''}}>
                    <div className="cart-items">
                        {cart.items.map(item => (
                            <div key={item.productId} className="cart-item">
                                <img src={item.productImage} alt={item.title} className="item-image" />
                                <div className="item-details">
                                    <h3 className="item-title">{item.title}</h3>
                                    <p className="item-price">${(item.salePrice > 0 ? item.salePrice : item.price).toFixed(2)}</p>
                                    <div className="item-actions">
                                        <div className="quantityselector">
                                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1,item.totalStock)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1,item.totalStock)}>+</button>
                                        </div>
                                        <button onClick={() => handleRemoveItem(item.productId)} className="remove-btn">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                <div className="order-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (18%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="summary-total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button className="btn-checkout" onClick={() => handleCheckout()}>{isCheckout ? 'Continue to Shipping' : 'Proceed to Checkout'}</button>
                    </div>
                </div>
            </div>
        );
    };