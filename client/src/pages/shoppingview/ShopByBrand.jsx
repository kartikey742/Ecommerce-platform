// src/components/common/ShopByBrand.jsx

import React from 'react';

// Import brand logos from Simple Icons set in react-icons
import { 
  SiNike, SiAdidas, SiPuma, Si1001Tracklists, SiZara, SiViaplay 
} from "react-icons/si";
import { useNavigate } from 'react-router-dom';
const brands = [
  { id: "nike", label: "Nike", icon: <SiNike size={50} /> },
  { id: "adidas", label: "Adidas", icon: <SiAdidas size={50} /> },
  { id: "puma", label: "Puma", icon: <SiPuma size={50} /> },
  { id: "levi", label: "Levi's", icon: <Si1001Tracklists size={50} /> },
  { id: "zara", label: "Zara", icon: <SiZara size={50} /> },
  { id: "h&m", label: "H&M", icon: <SiViaplay size={50} /> },
];

const ShopByBrand = () => {
  const navigate=useNavigate()
  const handleBrand=(id)=>{
    navigate(`/shop/listing?brand=${encodeURIComponent(id)}`)
    
  }
  return (
    <section className="shop-by-brand">
      <h2 className="section-title">Shop by Brand</h2>
      <div className="brand-container">
        {brands.map((brand) => (
          // Here we use the reusable .icon-card class
          <div key={brand.id} className="icon-card" onClick={() => {handleBrand(brand.id)}}>
            <div className="icon-card-wrapper">
              {brand.icon}
            </div>
            <h3 className="icon-card-title">{brand.label}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByBrand;