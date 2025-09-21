import React from 'react'
import { ProductFilter } from '../../components/shoppingview/ProductFilter'

export const Listing = () => {
  return (
    <div id='mainlisting'>
      <ProductFilter/>
      <div id='productlist'>
      <h1>All Products</h1>
      <p>10 products</p>
      </div>
    </div>
  )
}
