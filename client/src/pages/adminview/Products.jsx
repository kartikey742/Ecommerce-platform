import React from 'react'
import { useState,useEffect } from 'react'
import AddProductModal from '../../components/adminview/product/AddProductModal'
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { IoStorefrontOutline } from "react-icons/io5";
import '../../css/AdminView.css'
export const Products = ({ products, setProducts ,fetchProducts}) => {
    const [editingProduct, setEditingProduct] = useState(null);
 
   
const Delete=async(id)=>{
const res=await fetch(process.env.REACT_APP_BASE_URL+`/admin/products/delete/${id}`,{
         method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
      fetchProducts();
      const data=await res.json();
      console.log(data);

}
  return (
    <div className="admin-products-container">
      <div className="admin-products-header">
        <h2 className="admin-products-title">
          <IoStorefrontOutline className="admin-page-icon" />
          Products Management
        </h2>
        <AddProductModal editingProduct={editingProduct} fetchProducts={fetchProducts} setEditingProduct={setEditingProduct} />
      </div>

      <div className="admin-products-list">
        <h2>All Products</h2>
        <ul>
          {products?.map((p) => (
            <li key={p._id} className="admin-product-item">
              <div className="admin-product-image">
                <img src={p.productImage} alt={p.title} />
              </div>
              <div className="admin-product-info">
                <div className="admin-product-title">{p.title}</div>
                <div className="admin-product-price">${p.price}</div>
                <div className="admin-product-description">{p.description}</div>
              </div>
              <div className="admin-product-actions">
                <button className="admin-edit-btn" onClick={() => {setEditingProduct(p)
                  console.log(p);
                }}>
                  <FiEdit className="admin-btn-icon" />
                  Edit
                </button>
                <button className="admin-delete-btn" onClick={() =>Delete(p._id)}>
                  <MdDeleteOutline className="admin-btn-icon" />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
