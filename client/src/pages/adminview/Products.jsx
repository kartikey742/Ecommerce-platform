import React from 'react'
import { useState,useEffect } from 'react'
import AddProductModal from '../../components/adminview/product/AddProductModal'
export const Products = () => {
    const [editingProduct, setEditingProduct] = useState(null);
  const [products, setProducts] = useState([]);
    const fetchProducts = async () => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/products/get`, {
      credentials: "include",
    });
    const data = await res.json();
    console.log(data.data);
    setProducts(data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);
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
    <div>
      <AddProductModal editingProduct={editingProduct} fetchProducts={fetchProducts} setEditingProduct={setEditingProduct} />

      <h2>All Products</h2>
      <ul>
        {products?.map((p) => (
          <li key={p._id}>
            {p.title} - ${p.price}
            {p.description}
            <button onClick={() => {setEditingProduct(p)
              console.log(p);
              
            }}>Edit</button>
            <button onClick={() =>Delete(p._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
