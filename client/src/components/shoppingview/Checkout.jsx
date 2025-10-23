import React from 'react';
import checkoutBanner from '../../assets/account.jpg';
import '../../css/Checkout.css';
import { Address } from './Address';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Cart } from '../../pages/Cart';
import { useDispatch } from 'react-redux';
import { createNewOrder, capturePayment } from '../../store/orderSlice';
import { toast } from 'react-toastify';
export const Checkout = ({ cart, setCart }) => {
 
  const { razorpayOrderId, orderId, amount, currency } = useSelector((state) => state.shoppingOrder);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
   const [addressList, setAddressList] = useState([])
  const { user } = useSelector((state) => state.auth)
  const [selectedAddress, setSelectedAddress] = useState(null);

    let totalCartAmount =
    cart && cart.items && cart.items.length > 0
      ? cart.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;
      totalCartAmount+=0.18*totalCartAmount
      if(totalCartAmount<500)
        totalCartAmount+=50;

 function handleInitiateRazorpayPayment() {
  if (cart.items.length === 0) {
    toast.error("Your cart is empty. Please add items to proceed");
    return;
  }
  if (selectedAddress === null) {
    toast.error("Please select an address to proceed");
    return;
  }

  const orderData = {
    userId: user?.id,
    cartId: cart?._id,
    cartItems: cart.items.map((singleCartItem) => ({
      productId: singleCartItem?.productId,
      title: singleCartItem?.title,
      image: singleCartItem?.productImage,
      price:
        singleCartItem?.salePrice > 0
          ? singleCartItem?.salePrice
          : singleCartItem?.price,
      quantity: singleCartItem?.quantity,
    })),
    addressInfo: {
      addressId: selectedAddress?._id,
      address: selectedAddress?.address,
      city: selectedAddress?.city,
      pincode: selectedAddress?.pincode,
      phone: selectedAddress?.phone,
      notes: selectedAddress?.notes,
    },
    orderStatus: "pending",
    paymentMethod: "razorpay",
    paymentStatus: "pending",
    totalAmount: parseFloat(totalCartAmount.toFixed(2)),
    orderDate: new Date().toISOString(),
    orderUpdateDate: new Date().toISOString(),
  };

  dispatch(createNewOrder(orderData)).then((data) => {
    if (data?.payload?.success) {
      setIsPaymentStart(true);
      handleRazorpayPayment(data.payload);
    } else {
      setIsPaymentStart(false);
      toast.error(data?.payload?.message || "Failed to create order");
    }
  });
}

  function handleRazorpayPayment(orderData) {
    const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
    
    if (!razorpayKeyId || razorpayKeyId === "undefined") {
      toast.error("Razorpay configuration error. Please contact support.");
      setIsPaymentStart(false);
      return;
    }
    
    const options = {
      key: razorpayKeyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Your E-commerce Store",
      description: "Purchase from E-commerce Store",
      order_id: orderData.razorpayOrderId,
      handler: function (response) {
        // Payment successful
        const paymentData = {
          paymentId: orderData.razorpayOrderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          orderId: orderData.orderId,
        };
        
        dispatch(capturePayment(paymentData)).then((data) => {
          if (data?.payload?.success) {
            toast.success("Payment successful! Order confirmed.");
            setCart({ items: [] });
            window.location.href = "/shop/payment-success";
          } else {
            toast.error("Payment verification failed");
          }
        });
      },
      prefill: {
        name: user?.userName || "",
        email: user?.email || "",
        contact: selectedAddress?.phone || "",
      },
      theme: {
        color: "#0ea5e9",
      },
      modal: {
        ondismiss: function() {
          toast.info("Payment cancelled by user");
          setIsPaymentStart(false);
        }
      }
    };

    try {
      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        toast.error("Payment gateway not loaded. Please refresh the page and try again.");
        setIsPaymentStart(false);
        return;
      }
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsPaymentStart(false);
      });
      rzp.open();
    } catch (error) {
      toast.error("Unable to load payment gateway. Please try again.");
      setIsPaymentStart(false);
    }
  }
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
const res = await fetch(`http://localhost:5000/api/shop/address/get/${user.id}`);
                const data = await res.json();
                console.log(data);
                setAddressList(data.data || []);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };
        
        if (user?.id) {
            fetchAddresses();
        }
    }, [user?.id])
    console.log(selectedAddress);
    
  return (
    <div className="checkout-container">
      {/* Checkout Banner - Similar to Account page but without user info */}
      <div className="checkout-banner">
        <img src={checkoutBanner} alt="Checkout" className="banner-image" />
        <div className="banner-overlay">
          <div className="banner-content">
            <h1 className="checkout-title">Checkout</h1>
            <p className="checkout-subtitle">Complete your purchase</p>
          </div>
        </div>
      </div>

     <div className="checkout-main">
      <div className="checkout-content">
       <Address addressList={addressList} setAddressList={setAddressList} isCheckout={true} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} ></Address >
      </div>
      <div className='cart-checkout'>
      <Cart isCheckout={true} setCart={setCart} cart={cart} handleInitiateRazorpayPayment={handleInitiateRazorpayPayment}></Cart>
      </div>
     </div>
    </div>
  );
};