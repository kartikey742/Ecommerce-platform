import React from 'react'
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
export const ProductFilter = () => {
  return (
    <div id='mainproductfilter'>
      <h2>Filter Products</h2>
      <div className="filter-section">
        <h3>Category</h3>
        <ul>
          {filterOptions.category.map(option => (
            <li key={option.id}>
              <input type="checkbox" id={option.id} />
              <label htmlFor={option.id}>{option.label}</label>
            </li>
          ))}
        </ul>
      </div>
      <div className="filter-section">
        <h3>Brand</h3>
        <ul>
          {filterOptions.brand.map(option => (
            <li key={option.id}>
              <input type="checkbox" id={option.id} />
              <label htmlFor={option.id}>{option.label}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
