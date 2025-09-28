import React from 'react'
import { Link } from 'react-router-dom';
import { LuWarehouse } from "react-icons/lu";
import { MdOutlineShoppingCart } from "react-icons/md";
import { ProfileDropdown } from '../common/ProfileDropdown';
import { useNavigate } from 'react-router-dom';
export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Men",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing",
  },
  {
    id: "footwear",
    label: "Footwear",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Accessories",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];
export const Header = () => {
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
    <div id='logo'>
      <MdOutlineShoppingCart  size={25} onClick={()=>navigate("/shop/cart")} cursor="pointer"/>
      <ProfileDropdown />   
    </div>
    </div>
   
  )
}
