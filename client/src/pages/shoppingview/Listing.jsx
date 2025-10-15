import { useEffect, useState } from 'react'
import { ProductFilter } from '../../components/shoppingview/ProductFilter'
import { BiSortAlt2, BiGrid, BiList } from "react-icons/bi";
import { FiSearch, FiFilter } from "react-icons/fi";
import {toast} from "react-toastify";
import { useNavigate, useSearchParams } from 'react-router-dom';


const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const Listing = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Price: Low to High");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

 useEffect(() => {
    const cat = searchParams.get('category');
    const brd = searchParams.get('brand');
    if (cat) setCategory([cat]);
    if (brd) setBrand([brd]);
  }, [searchParams]);

  // This effect fetches products whenever a filter or sort option changes
  useEffect(() => {
    const getProducts = async () => {
      const params = new URLSearchParams();
      if (category.length) params.append('category', category.join(','));
      if (brand.length) params.append('brand', brand.join(','));
      params.append('sortBy', selectedSort);

      const toastId = toast.loading("Loading products...");
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/shop/products/get/?${params.toString()}`);
        const data = await res.json();
        setProducts(data?.data || []);
        toast.update(toastId, { render: "Products loaded!", type: "success", isLoading: false, autoClose: 2000 });
      } catch (e) {
        console.log(e);
        toast.update(toastId, { render: "Failed to load products.", type: "error", isLoading: false, autoClose: 3000 });
      }
    };
    getProducts();
  }, [category, brand, selectedSort]);



  const handleSelect = (option) => {
    setSelectedSort(option.label);
    setOpenDialog(false);
  };

  return (
    <div className="listing-container">


      <div className="listing-main">
        {/* Sidebar Filter */}
        <aside className={`filter-sidebar ${showFilters ? 'show-mobile' : ''}`}>
          <div className="filter-header">
            <h3>Filters</h3>
            <button 
              className="close-filters-btn"
              onClick={() => setShowFilters(false)}
            >
              ×
            </button>
          </div>
          <ProductFilter 
            category={category} 
            setCategory={setCategory} 
            brand={brand} 
            setBrand={setBrand} 
          />
        </aside>

        {/* Main Content */}
        <main className="products-section">
          {/* Controls Bar */}
          <div className="controls-bar">
            <div className="controls-left">
              <button 
                className="filter-toggle-btn"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter />
                Filters
              </button>
              <span className="product-count">
                {products?.length || 0} products found
              </span>
            </div>

            <div className="controls-right">
              {/* View Toggle */}
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <BiGrid />
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  {/* <BiList /> */}
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="sort-container">
                <button 
                  className="sort-btn"
                  onClick={() => setOpenDialog(!openDialog)}
                >
                  <BiSortAlt2 />
                  {selectedSort || "Sort By"}
                </button>
                
                {openDialog && (
                  <div className="sort-dropdown">
                    {sortOptions.map((option) => (
                      <button
                        key={option.id}
                        className="sort-option"
                        onClick={() => handleSelect(option)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`products-grid ${viewMode} ${isLoading ? 'loading' : ''}`}>
            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading amazing products...</p>
              </div>
            ) : products?.length > 0 ? (
              products.map((product) => (
                <div 
                  key={product._id} 
                  className="product-card"
                  onClick={() => navigate(`/shop/product/${product._id}`)}
                >
                  <div className="product-image-container">
                    <img 
                      src={product.productImage} 
                      alt={product.title}
                      className="product-image"
                    />
                    <div className="product-overlay">
                      <button className="quick-view-btn">Quick View</button>
                    </div>
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-brand">{product.brand}</p>
                    
                    <div className="price-section">
                      {product.salePrice > 0 ? (
                        <div className="price-container">
                          <span className="sale-price">${product.salePrice}</span>
                          <span className="original-price">${product.price}</span>
                          <span className="discount-badge">
                            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="regular-price">${product.price}</span>
                      )}
                    </div>
                    
                    <p className="product-description">{product.description}</p>
                    
                    <button className="add-to-cart-btn">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🛍️</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setCategory([]);
                    setBrand([]);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Overlay for mobile filters */}
      {showFilters && <div className="overlay" onClick={() => setShowFilters(false)}></div>}
    </div>
  );
};