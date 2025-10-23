import React from 'react'
import { MdStars } from "react-icons/md";
import { BiChart } from "react-icons/bi";
import { FiShoppingBag } from "react-icons/fi";
import { MdLocalShipping } from "react-icons/md";
import '../../css/AdminView.css'

export const Features = () => {
  return (
    <div className="admin-features-container">
      <div className="admin-features-header">
        <h1 className="admin-features-title">
          <MdStars className="admin-page-icon" />
          Admin Features
        </h1>
      </div>
      
      <div className="admin-features-grid">
        <div className="admin-feature-card">
          <BiChart className="admin-feature-icon" />
          <h3 className="admin-feature-title">Analytics</h3>
          <p className="admin-feature-description">Track your business performance with detailed analytics and reports.</p>
        </div>
        
        <div className="admin-feature-card">
          <FiShoppingBag className="admin-feature-icon" />
          <h3 className="admin-feature-title">Product Management</h3>
          <p className="admin-feature-description">Easily add, edit, and manage your product catalog.</p>
        </div>
        
        <div className="admin-feature-card">
          <MdLocalShipping className="admin-feature-icon" />
          <h3 className="admin-feature-title">Order Processing</h3>
          <p className="admin-feature-description">Efficiently manage and process customer orders.</p>
        </div>
      </div>
    </div>
  )
}
