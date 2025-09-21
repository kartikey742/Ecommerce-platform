import React from 'react'
import { LuLayoutDashboard } from "react-icons/lu";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { LuClipboardCheck } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon:<LuLayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <RiShoppingBasket2Fill  />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <LuClipboardCheck  />,
  },  
];
export const  Sidebar = () => {
  const navigate=useNavigate()
  return (
    <div className='sidebar'>
      {
        adminSidebarMenuItems.map((item)=>(
          <div key={item.id} className='sidebar-item' onClick={()=>{navigate(item.path)}}>
            <div>{item.icon}</div>
            <div>{item.label}</div>
          </div>
        ))
      }
    </div>
  )
}
