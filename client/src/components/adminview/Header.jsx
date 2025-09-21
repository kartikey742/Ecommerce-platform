import React from 'react'
import { useSelector } from 'react-redux';
import { setUser,setIsAuthenticated } from '../../store/authSlice';
import { useDispatch } from 'react-redux';
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
    <div>
      <button onClick={logout}>log out</button>
    </div>
  )
}
