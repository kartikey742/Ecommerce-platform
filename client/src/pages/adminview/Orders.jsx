import React from 'react'
import AddProductModal from '../../components/adminview/product/AddProductModal'
import { MdShoppingCart } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { MdCheckCircle } from "react-icons/md";
import { FiEye } from "react-icons/fi";
import '../../css/AdminView.css'
import { useState,useEffect } from 'react';
import { ViewDetailsModal } from '../../components/shoppingview/ViewDetailsModal';
export const Orders = ({ orders,setOrders }) => {
  const [orderDetails,setOrderDetails]=useState({})
  const [open,setOpen]=useState(false)

           const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return '#10b981'
      case 'shipped': return '#3b82f6'
      case 'processing': return '#f59e0b'
      default: return '#6b7280'
    }
  }


const handleFunction = async(e, orderId) => {
  const updatedOrders = orders.map(order =>
    order._id === orderId ? { ...order, orderStatus: e.target.value } : order
  );
  setOrders(updatedOrders);
  const res=await fetch(process.env.REACT_APP_BASE_URL+`/admin/orders/update`,{
    method:"PUT",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({orderId,orderStatus:e.target.value})
  });
  const data=await res.json()
  console.log(data);
  
};
  return (
    <>
    <div className="admin-orders-container">
      <div className="admin-orders-header">
        <h1 className="admin-orders-title">
          <MdShoppingCart className="admin-page-icon" />
          Orders Management
        </h1>
      </div>
      
      <div className="admin-orders-grid">
        {orders.map((order) => (
          <div key={order.id} className="admin-order-card">
            <div className="admin-order-card-header">
              <div className="admin-order-id">
                <MdShoppingCart className="admin-order-icon" />
                Order #{order._id}
              </div>
              <div className="admin-order-date">
                <FaCalendarAlt className="admin-order-icon" />
                {new Date(order.orderDate).toLocaleDateString()}
              </div>
            </div>
            <div className="admin-order-body">
              <div className='middle-div'>
              <div>
              <div className="admin-order-status" style={{backgroundColor: getStatusColor(order.orderStatus)}}>
                <MdCheckCircle className="admin-status-icon" />
                {order.orderStatus}
              </div>
              <div className="admin-order-amount">Rs.{order.totalAmount}</div>
              </div>
              <div>
                <select  value={order.orderStatus}
    onChange={(e) => handleFunction(e, order._id)}
  >
                  <option value="delivered">Delivered</option>
                  <option value="shipped">Shipped</option>
                  <option value="processing">Processing</option>
                  <option value="confirmed">Confirmed</option>
                </select>
              </div>
              </div>
              <button className="admin-order-details-btn" onClick={() =>{setOrderDetails(order) ;setOpen(true)}}>
                <FiEye className="admin-btn-icon" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
      {open && <ViewDetailsModal setIsOpen={setOpen} isOpen={open} orderDetails={orderDetails}/>}
        </>
  )
}
