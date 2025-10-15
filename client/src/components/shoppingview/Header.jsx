import React from 'react'
import { Link } from 'react-router-dom';
import { LuWarehouse } from "react-icons/lu";
import { MdOutlineShoppingCart } from "react-icons/md";
import { ProfileDropdown } from '../common/ProfileDropdown';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Men",
    path: "/shop/listing?category=men",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/listing?category=women",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing?category=kids",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/shop/listing?category=footwear",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing?category=accessories",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];
export const Header = () => {
  const {user}=useSelector((state)=>state.auth)
  const navigate=useNavigate()
  return (
    <div className='shoppingheader'>
      <div id='logo'>
      <LuWarehouse size={20} />
      <h2>Ecommerce</h2>
      </div>
      <div id='navbar'>
      {
        shoppingViewHeaderMenuItems.map((item)=>{
          return <Link key={item.id} to={item.path} id='link'>{item.label}</Link>
        })
      }
      </div>
      {user?
        (<div id='logo'>
      <MdOutlineShoppingCart  size={25} onClick={()=>navigate("/shop/cart")} cursor="pointer"/>
      <ProfileDropdown />   
    </div>):
    <div id='logo'>
      <button onClick={()=>navigate("/auth/login")}>Login</button>
      <button onClick={()=>navigate("/auth/register")}>Register</button>
    </div>
    }
    </div>
   
  )
}
