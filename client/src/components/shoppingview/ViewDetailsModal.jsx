import React from 'react';
import { FiX, FiCalendar, FiTruck, FiCreditCard, FiPackage } from 'react-icons/fi';
import '../../css/viewDetailsModal.css';

export const ViewDetailsModal = ({ isOpen, setIsOpen, orderDetails }) => {
    const calculateCartTotal = () => {
    return orderDetails.cartItems.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };
  console.log((calculateCartTotal()*0.18).toFixed(2));
  
  if (!isOpen) return null;
console.log(orderDetails);
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true});
    };
  return (
    <div className="modal-overlay">
      <div className="order-modal" >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">Order Details</h2>
          </div>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Order Status & Payment Info */}
          <div className="info-grid">
            <div className="info-card">
              <div className="info-header">
                <FiCreditCard className="info-icon" />
                <h3>Payment</h3>
              </div>
              <div className="payment-info">
                <p>Method: <span className="payment-method">{orderDetails.paymentMethod}</span></p>
                <p>Status: <span className="payment-status">{orderDetails.paymentStatus}</span></p>
                <p>Payment ID: <span className="payment-id">{orderDetails.paymentId}</span></p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-header">
                <FiCalendar className="info-icon" />
                <h3>Order Date</h3>
              </div>
              <p className="order-date">{formatDate(orderDetails.orderDate)}</p>
            </div>
<div className="info-card">
    <div className="info-header">
      <FiTruck className="info-icon" />
      <h3>Shipping</h3>
    </div>
    <p className="shipping-amount">₹{calculateCartTotal() >= 500 ? 'Free Shipping': 50}</p>
  </div>

  {/* ADD TAX CARD HERE */}
  <div className="info-card">
    <div className="info-header">
      <FiCreditCard className="info-icon" />
      <h3>Tax</h3>
    </div>
    <p className="tax-amount">₹{(calculateCartTotal()*0.18).toFixed(2)}</p>
    <p className="tax-rate">18% GST</p>
  </div>
            <div className="info-card total-card">
              <div className="info-header">
                <FiPackage className="info-icon" />
                <h3>Total Amount</h3>
              </div>
              <p className="total-amount">₹{orderDetails.totalAmount}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="items-section">
            <div className="section-header">
              <FiPackage className="section-icon" />
              <h3>Order Items ({orderDetails.cartItems.length})</h3>
            </div>
            <div className="items-list">
              {orderDetails.cartItems.map((item, index) => (
                <div key={index} className="item-card">
                  <div className="item-image">
                    <img 
                      src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'} 
                      alt={item.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                      }}
                    />
                  </div>
                  <div className="item-details">
                    <h4 className="item-title">{item.title}</h4>
                    <p className="item-price">₹{item.price} each</p>
                    <p className="item-quantity">Quantity: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </div>
    </div>
  );
};