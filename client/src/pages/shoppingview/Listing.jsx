import { useEffect, useState } from 'react'
import { ProductFilter } from '../../components/shoppingview/ProductFilter'
import { BiSortAlt2 } from "react-icons/bi";
import {toast} from "react-toastify";
import { useNavigate } from 'react-router-dom';
 const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const Listing = () => {
  const [openDialog, setOpenDialog] = useState(false);
 const [selectedSort, setSelectedSort] = useState("Price: Low to High");
  const [products, setProducts] = useState([])

    const [category, setCategory] =useState(JSON.parse(localStorage.getItem('category'))||[]);
  const [brand, setBrand] = useState(JSON.parse(localStorage.getItem('brand'))||[]);
  const navigate=useNavigate()
   useEffect(()=>{
    const params=new URLSearchParams()
    if(category.length) params.append('category',category.join(','))  
    if(brand.length) params.append('brand',brand.join(','))
     params.append('sortBy',selectedSort)
      console.log(params.toString());
     const getProducts=async()=> {  
       const toastId = toast.loading("Loading products...");
      try{
        const res=await fetch(process.env.REACT_APP_BASE_URL+"/shop/products/get/?"+params.toString())
        const data=await res.json()
        setProducts(data?.data)
      toast.update(toastId, { 
      render: "Products loaded successfully!", 
      type: "success", 
      isLoading: false, 
      autoClose: 3000 
    });
      }catch(e){
        console.log(e);
           toast.update(toastId, { 
      render: "Failed to load products.", 
      type: "error", 
      isLoading: false, 
      autoClose: 3000 
    });
        
      }
  }
  getProducts()  
      
  },[category,brand,selectedSort])
 
 

console.log(products);

  const handleSelect = (option) => {
    setSelectedSort(option.label);
    setOpenDialog(false);
    console.log("Selected Sort:", option.id);
  };

  return (
    <div id='mainlisting'>
      <ProductFilter category={category} setCategory={setCategory} brand={brand} setBrand={setBrand} />

      <div id='productlist'>
        <div id='productlistdiv'>
          <h1>All Products</h1>

          <div id='productlistoptions'>
            <p>10 products</p>
            <div id='sort' onClick={() => setOpenDialog(!openDialog)}>
              <BiSortAlt2 /> {selectedSort || "Sort By"}
            </div>
          </div>
        </div>
    <div id="productsgrid">
  {products?.map((product) => (
    <div key={product._id} className="productcard" onClick={()=>{navigate(`/shop/product/${product._id}`)}}>
      <img src={product.productImage} alt={product.title} />
      <h3>{product.title}</h3>
      {product.salePrice > 0 ? (
        <div className="price-row">
          <span className="old-price">${product.price}</span>
          <span className="sale-price">${product.salePrice}</span>
        </div>
      ) : (
        <p className="price">${product.price}</p>
      )}

      <p className="description">{product.description}</p>
      <p className="brand">{product.brand}</p>
    </div>
  ))}
</div>

      </div>

      {openDialog && (
        <div className="sort-overlay" onClick={() => setOpenDialog(false)}>
          <div className="sort-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Sort Options</h3>
            {sortOptions.map((option) => (
              <button
                key={option.id}
                className="sort-option-btn"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
