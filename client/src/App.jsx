  import { useState } from 'react'
  import './App.css'
  
 
  import './css/product.css'
  import './css/shopping.css'
  import './css/DetailsPage.css'
  import './css/common.css'
  import { Navigate, Route, Routes } from 'react-router-dom'
import {UserLayout} from './components/auth/layout'
import {Register} from './pages/auth/register'
import {Login} from './pages/auth/login'
import { AdminLayout } from './components/adminview/AdminLayout'
import { Dashboard } from './pages/adminview/Dashboard'
import { Products } from './pages/adminview/Products'
import { Orders } from './pages/adminview/Orders'
import {Features} from './pages/adminview/Features'
import { ShoppingLayout } from './components/shoppingview/ShoppingLayout'
import { Home } from './pages/shoppingview/Home'
import { Listing } from './pages/shoppingview/Listing'
import { Account } from './components/shoppingview/Account'
import { Checkout } from './components/shoppingview/Checkout'
import CheckAuth from './components/common/Checkauth'
import { Unauthpage } from './pages/Unauthpage'
import { useSelector } from 'react-redux'
import {setUser,setIsLoading,setIsAuthenticated   } from './store/authSlice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { DetailsPage } from './pages/shoppingview/DetailsPage'
import {Cart} from './pages/Cart'
import { Header } from './components/shoppingview/Header'
import { PaymentSuccessPage } from './pages/PaymentSuccessPage'

  function App() {
      const navigate = useNavigate();
    const dispatch=useDispatch();
    const [products,setProducts]=useState([]);
    const [orders,setOrders]=useState([])
    const [cart, setCart] = useState(null);
  const{isAuthenticated}=useSelector((state)=>state.auth)
  const{user}=useSelector((state)=>state.auth)
useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(process.env.REACT_APP_BASE_URL+"/auth/check-auth", {
          credentials: "include",
        });
        console.log(res);
        if(!res.ok){
          console.log("user not authenticated");
          dispatch(setIsLoading(false));
          return;
        }
        const data = await res.json();
        if (data.success) {
          dispatch(setUser(data.user));
          dispatch(setIsLoading(false));
          dispatch(setIsAuthenticated(true));
          console.log(data);
          
        } 
        else
          console.log(data);
          
      } catch (err) {
        console.log(err);  
      }
    };

    checkAuth();
  }, []);
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

  useEffect(()=>{ 
      const fetchOrders=async()=>{
            try{
              const res=await fetch(process.env.REACT_APP_BASE_URL +`/admin/orders/get`);
              const data=await res.json();
              console.log(data);
              setOrders(data.data||[]);
              
            }
            catch(err){
              console.log(err);
              
            }
          }
          fetchOrders()
        },[])
    return (
      <div> 
        {/* <Header></Header> */}
    {(!isAuthenticated || (user && user.role === 'consumer')) && <Header></Header>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/auth' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><UserLayout/></CheckAuth>}>
          <Route path='register' element={<Register/>}/>
          <Route path='login' element={<Login/>}/>
        </Route>
        <Route path='/admin' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AdminLayout orders={orders} /></CheckAuth>}>
        <Route path='dashboard' element={<Dashboard products={products} orders={orders} />}/>
        <Route path='products' element={<Products products={products} setProducts={setProducts} fetchProducts={fetchProducts} />}/>
        <Route path='features' element={<Features/>}/>
        <Route path='orders' element={<Orders orders={orders} setOrders={setOrders} />}/>
        </Route>
        <Route path='/shop' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><ShoppingLayout/></CheckAuth>}>
        
        <Route path='listing' element={<Listing/>}/>
        <Route path='account' element={<Account/>}/>
        <Route path='checkout' element={<Checkout cart={cart} setCart={setCart} />}/>
        <Route path='product/:productId' element={<DetailsPage />} />
        <Route path='cart' element={<Cart isCheckout={false} setCart={setCart} cart={cart} />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
        </Route> 
        <Route path='unauth-page' element={<Unauthpage></Unauthpage>}/>
      </Routes>
      </div>
    )
  }

  export default App
