import React, { useState } from 'react'
import { FiCalendar, FiTruck} from 'react-icons/fi'
export const Orders = ({ orders, setOrders , setIsOpen,setOrder }) => {
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10b981'
      case 'shipped': return '#3b82f6'
      case 'processing': return '#f59e0b'
      default: return '#6b7280'
    }
  }
  return (
    <div className="orders-section">
              <div className="section-header">
                <h2>My Orders</h2>
                <p>Track and manage your orders</p>
              </div>
              <div className="orders-grid">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                  {  console.log(order.orderStatus)}
                    <div className="orders-page-header">
                      <div className="orders-page-info">
                        <h3 className="orders-page-id">#{order._id}</h3>
                        <div className="orders-page-meta">
                          <span className="orders-page-date">
                            <FiCalendar size={14} />
                            {new Date(order.orderDate).toLocaleDateString()}
                          </span>
                          {/* <span 
                            className="orders-page-status"
                            style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                            <FiTruck size={12} />
                            {order.orderStatus}
                          </span> */}
                        </div>
                      </div>
                   
                    </div>
                    <div className="order-body">
                    <button className="orders-page-track-btn">
                        Track Order
                      </button>
                      <div className="order-details">
                        <p className="order-items">{order.cartItems.length} item(s)</p>
                        <p className="order-total">Rs.{order.totalAmount}</p>
                      </div>
                    </div>
                    <div className="order-actions">
                      <button className="btn-secondary" onClick={()=>{setIsOpen(true); setOrder(order)}}>View Details</button>
                        <button className="btn-secondary" style={{color:'white', backgroundColor: getStatusColor(order.orderStatus) }}>{order.orderStatus}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  )
}
