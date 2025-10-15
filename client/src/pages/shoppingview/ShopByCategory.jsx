// src/components/common/ShopByCategory.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

import { FaMale, FaFemale, FaChild } from 'react-icons/fa';
import { GiBootStomp , GiDiamondRing } from 'react-icons/gi';
const dummyCategories = [
  {
    id: 'men',
    name: 'Men',
    // Step 2: Assign the icon component itself, not a URL string
    icon: <FaMale size={40} /> // 'size' controls how big the icon is
  },
  {
    id: 'women',
    name: 'Women',
    icon: <FaFemale size={40} />
  },
  {
    id: 'kids',
    name: 'Kids',
    icon: <FaChild size={40} />
  },
   {
    id: 'Footwear',
    name: 'Footwear',
    icon: <GiBootStomp   size={40} />
  },
   {
    id: 'Accessories',
    name: 'Accessories',
    icon: <GiDiamondRing  size={40} />
  },
];

const ShopByCategory = ({ categories = dummyCategories }) => {
  const navigate = useNavigate();
  const handleCategory = (id) => {
    navigate(`/shop/listing?category=${id}`);
  };
  return (
    <section className="shop-by-category">
      <h2 className="section-title">Shop by Category</h2>
      <div className="category-container">
        {categories.map((category) => (
          <div key={category.id} className="category-item" onClick={() => handleCategory(category.id)}>
            <div className="category-logo-wrapper">
              {/* Step 3: Render the icon directly */}
              {category.icon}
            </div>
            <h3 className="category-title">{category.name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopByCategory;  