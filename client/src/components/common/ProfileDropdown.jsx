import React from 'react'
import { useSelector } from 'react-redux'
import { setUser,setIsAuthenticated } from '../../store/authSlice';
import { useDispatch } from 'react-redux'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export const ProfileDropdown = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
  const logout=async()=>{
    const res=await fetch(`${process.env.REACT_APP_BASE_URL}/auth/logout`,{
      method:"POST",
      credentials:"include"
    });
    const data=await res.json();
    console.log(data);
    dispatch(setUser(null));
    dispatch(setIsAuthenticated(false));
  }
    const [open, setOpen] = useState(false);
    const {user}=useSelector(state=>state.auth)
    console.log(user);
  const initials=user.userName[0].toUpperCase() + user.userName[1].toUpperCase();
  const bgColor="#"+((1<<24)*Math.random()|0).toString(16).padStart(6,'0');
  return (
    <div id='mainprofile-dropdown'>

    <div id='profile-dropdown'
    onClick={() => setOpen(!open)}
      style={{
          backgroundColor: bgColor,
        }}
        >
     {initials}
        </div>
       {open && (
        <div className="profiledropdownbox">
          <button className="dropdown-item" onClick={logout}>
            Logout
          </button>
          <button className="dropdown-item" onClick={() => navigate('/shop/account')}>
            Account
          </button>
        </div>
      )}
    </div>
  )
}
