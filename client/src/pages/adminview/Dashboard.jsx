import React, { useEffect } from 'react'
import { MdDashboard } from "react-icons/md";
import { FiPackage } from "react-icons/fi";
import { BsCartCheck } from "react-icons/bs";
import { MdAttachMoney } from "react-icons/md";
import '../../css/AdminView.css'
import { useState } from 'react';
export const Dashboard = ({ products, orders }) => {
  let revenue = 0;
  orders.forEach(order => {
  revenue += parseInt(order.totalAmount);
});
  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <h1 className="admin-dashboard-title">
          <MdDashboard className="admin-page-icon" />
          Dashboard
        </h1>
        <p className="admin-dashboard-subtitle">Welcome to your admin panel</p>
      </div>
      
      <div className="admin-dashboard-stats">
        <div className="admin-stat-card">
          <FiPackage className="admin-stat-icon" />
          <div className="admin-stat-number">{products.length}</div>
          <div className="admin-stat-label">Total Products</div>
        </div>
        <div className="admin-stat-card">
          <BsCartCheck className="admin-stat-icon" />
          <div className="admin-stat-number">{orders.length}</div>
          <div className="admin-stat-label">New Orders</div>
        </div>
        <div className="admin-stat-card">
          <MdAttachMoney className="admin-stat-icon" />
          <div className="admin-stat-number">Rs.{revenue}</div>
          <div className="admin-stat-label">Revenue</div>
        </div>
      </div>
    </div>
  )
}
