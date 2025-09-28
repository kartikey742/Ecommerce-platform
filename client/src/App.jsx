  import { useState } from 'react'
  import './App.css'
  import './css/register.css'
  import './css/login.css'
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
import { Home } from './components/shoppingview/Home'
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
  function App() {
      const navigate = useNavigate();
    const dispatch=useDispatch();
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
  const handle=async(role)=>{
    console.log(role);
    
    dispatch(setIsLoading(true));
    dispatch(setUser({name:"super admin",role:role}));
    dispatch(setIsAuthenticated(true));
    dispatch(setIsLoading(false));  
    navigate('auth/login')
  }
    return (
      <div> 
      <Routes>
        <Route path='/' element={<div><button onClick={()=>{handle('consumer')}}>super login consumer</button><button onClick={()=>{handle('admin')}}>super login admin</button></div>}/>
        <Route path='/auth' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><UserLayout/></CheckAuth>}>
          <Route path='register' element={<Register/>}/>
          <Route path='login' element={<Login/>}/>
        </Route>
        <Route path='/admin' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AdminLayout/></CheckAuth>}>
        <Route path='dashboard' element={<Dashboard/>}/>
        <Route path='products' element={<Products/>}/>
        <Route path='features' element={<Features/>}/>
        <Route path='orders' element={<Orders/>}/>
        </Route>
        <Route path='/shop' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><ShoppingLayout/></CheckAuth>}>
        <Route path='home' element={<Home/>}/>
        <Route path='listing' element={<Listing/>}/>
        <Route path='account' element={<Account/>}/>
        <Route path='checkout' element={<Checkout/>}/>
        <Route path='product/:productId' element={<DetailsPage />} />
        <Route path='cart' element={<Cart />} />
        </Route> 
        <Route path='unauth-page' element={<Unauthpage></Unauthpage>}/>
      </Routes>
      </div>
    )
  }

  export default App
