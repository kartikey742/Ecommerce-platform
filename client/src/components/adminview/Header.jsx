import React from 'react'
import { useSelector } from 'react-redux';
import { setUser,setIsAuthenticated } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
import { MdAdminPanelSettings } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import '../../css/AdminView.css';
export const Header = () => {
  const dispatch=useDispatch()
  const logout=async()=>{
    const res=await fetch(`${process.env.REACT_APP_BASE_URL}/auth/logout`,{
      method:"POST",
      credentials:"include"
    });
    const data=await res.json();
    console.log(data);
    dispatch(setUser(null));
    dispatch(setIsAuthenticated(false));
    // <Navigate to='/'></Navigate>
  }

  return (
    <div className="admin-header">
      <div className="admin-header-title">
        <MdAdminPanelSettings className="admin-header-icon" />
        Admin Panel
      </div>
      <div className="admin-header-actions">
        <button className="admin-logout-btn" onClick={logout}>
          <BiLogOut className="admin-logout-icon" />
          Log Out
        </button>
      </div>
    </div>
  )
}
