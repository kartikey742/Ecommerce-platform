import React, { useEffect } from 'react'
import { useState } from 'react'
export const filterOptions = {
  category: [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "kids", label: "Kids" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};
export const ProductFilter = ({ category, setCategory, brand, setBrand }) => {

  const handleBrand=(id)=>{
    if(brand.includes(id)){
      setBrand(brand.filter((b)=>b!==id))
      localStorage.setItem('brand',JSON.stringify(brand.filter((b)=>b!==id)))
    }else{
      setBrand([...brand,id])
      localStorage.setItem('brand',JSON.stringify([...brand,id]))
    }
  }


  const handleCategory=(id)=>{
    if(category.includes(id)){
      setCategory(category.filter((c)=>c!==id))
      localStorage.setItem('category',JSON.stringify(category.filter((c)=>c!==id)))
    }else{
      setCategory([...category,id])
      localStorage.setItem('category',JSON.stringify([...category,id]))
    }
    
  }
  
  return (
    <div id='mainproductfilter'>
      <h2>Filter Products</h2>
      <div className="filter-section">
        <h3>Category</h3>
        <ul>
          {filterOptions.category.map(option => (
            <li key={option.id}>
              <input type="checkbox" id={option.id} checked={category.includes(option.id)} onChange={() => handleCategory(option.id)} />
              <label htmlFor={option.id}>{option.label}</label>
            </li>
          ))}
        </ul>
      </div>
      <div className="filter-section">
        <h3>Brand</h3>
        <ul>
          {filterOptions.brand.map(option => (
            <li key={option.id} >
              <input type="checkbox" id={option.id} checked={brand.includes(option.id)} onChange={() => handleBrand(option.id)} />
              <label htmlFor={option.id}>{option.label}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
