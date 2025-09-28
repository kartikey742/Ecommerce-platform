import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Loader} from '../../components/common/Loader';
import { StarRating } from '../../components/common/StarRating';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
const dummyProductData = {
  averageRating: 4.5,
  totalReviews: 128,
  reviews: [
    {
      id: 1,
      author: 'Priya S.',
      rating: 5,
      date: '2025-09-22',
      comment: 'Absolutely love this product! The quality is amazing and it fits perfectly. Highly recommended!'
    },
    {
      id: 2,
      author: 'Rohan M.',
      rating: 4,
      date: '2025-09-18',
      comment: 'Good product, does what it says. The color is slightly different from the picture, but still nice.'
    },
    {
      id: 3,
      author: 'Anjali K.',
      rating: 5,
      date: '2025-09-15',
      comment: 'Excellent customer service and fast delivery. The item itself is of top-notch quality. Will buy again.'
    }
  ]
};
export const DetailsPage = () => {
    const [loading, setLoading] = useState(true); // Start with loading true
    const [product, setProduct] = useState({}); // Start with null
    const [quantity, setQuantity] = useState(1);
    const { productId } = useParams();
    const [cart, setCart] = useState([]);
    const userId = useSelector((state) => state.auth.user?.id);
const {user}=useSelector((state)=>state.auth)
    useEffect(() => {
        // Define an async function inside the effect
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/shop/products/get/${productId}`);
                const data = await res.json();
                if (data.success) {
                    setProduct(data.data);
                    console.log(data.data);
                    
                } else {
                    // Handle the case where the product is not found
                    setProduct({}); 
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
                setProduct({}); // Handle fetch error
            } finally {
                setLoading(false);
            }
        };

        fetchProduct(); // Call the async function
    }, [productId]);
   useEffect(() => {
        const fetchCartData = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.REACT_APP_BASE_URL}/shop/cart/get/${userId}`);
                const data = await res.json();
                if (data.success) {
                    setCart(data.data.items);
                    console.log(data.data.items);
                    
                } else {
                    // If cart is not found (404), it's not an error, just an empty cart.
                    if (res.status === 404) {
                        setCart([]);
                    } else {
                      console.log(data.message);
                    }
                }
            } catch (err) {
                console.log(err);
              
            } finally {
                setLoading(false);
            }
        };

        fetchCartData();
    }, [userId]);
    const isProductInCart = cart.some(item => item.productId === product._id);
    const handleQuantityChange = (amount) => {
        setQuantity(prev => Math.max(1, Math.min(product.totalStock, prev + amount)));
    };
    const handleAdd=async()=>{
        try{
            if(isProductInCart)
                return toast.info("Product already in cart")
            setLoading(true)
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/shop/cart/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId:user.id,
                    productId:product._id,
                    quantity,
                }),
            });
            const data=await res.json();
            setLoading(false)
            setCart(data.data.items);
            toast.success('Added to cart successfully!')
            console.log(data);
            
        }
        catch(e){
            setLoading(false)
            toast.error('Failed to add to cart.')
            console.log(e);
            
        }
    }

    if (loading) {
        return <Loader></Loader>
    }

    if (!product) {
        return <div className="error-container">Product not found.</div>;
    }

    return (
        <div className="details-container">
            <div className="product-image-section">
                <img src={product.productImage} alt={product.title} className="product-image" />
            </div>
            
            <div className="product-details-section">
                <h2 className="product-brand">{product.brand}</h2>
                <h1 className="product-title">{product.title}</h1>
                <p className="product-description">{product.description}</p>
                
                <div className="product-price-container">
                    {product.salePrice > 0 ? (
                        <>
                            <span className="product-sale-price">${product.salePrice.toFixed(2)}</span>
                            <span className="product-original-price">${Math.abs(product.price).toFixed(2)}</span>
                        </>
                    ) : (
                        <span className="product-price">${Math.abs(product.price).toFixed(2)}</span>
                    )}
                </div>
                
                <p className="product-stock">
                    {product.totalStock > 0 ? `In Stock (${product.totalStock} available)` : 'Out of Stock'}
                </p>

                {product.totalStock > 0 && (
                    <>
                        <div className="quantity-selector">
                            <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                            <input type="text" value={quantity} readOnly />
                            <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.totalStock}>+</button>
                        </div>
                        <button onClick={handleAdd} className="add-to-cart-btn">{isProductInCart ? 'Added to Cart' : 'Add to Cart'}</button>
                    </>
                )}
            </div>

             <div className="product-reviews-section">
            <h2>Customer Reviews</h2>
            <div className="reviews-list">
                {dummyProductData.reviews.map(review => (
                    <div key={review.id} className="review-item">
                        <div className="review-header">
                            <span className="review-author">{review.author}</span>
                            <span className="review-date">{review.date}</span>
                        </div>
                        <StarRating rating={review.rating} />
                        <p className="review-comment">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};