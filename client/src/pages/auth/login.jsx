import React, { useState } from "react";

import { useSelector } from "react-redux";
import { setIsAuthenticated, setUser } from "../../store/authSlice";
import { useDispatch } from "react-redux";
import { Loader } from "../../components/common/Loader";
import {toast} from 'react-toastify'
import { setIsLoading } from "../../store/authSlice";
 import '../../css/login.css'
export  function Login() {
  const {isLoading}=useSelector((state)=>state.auth);
  console.log(isLoading);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const {isAuthenticated,user}=useSelector((state)=>state.auth);
  const [errors, setErrors] = useState({});
const dispatch=useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value, 
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async(e) => {
    dispatch(setIsLoading(true));
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      console.log("Login data submitted:", formData);
     
    }
     const response = await fetch(process.env.REACT_APP_BASE_URL+"/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
         credentials: "include"
      });
      const data =await response.json();
      console.log(data);
      
      if(data.success){
        dispatch(setUser(data.user));
        dispatch(setIsAuthenticated(true));
      }
      else{
        toast.error(data.message);
        dispatch(setIsLoading(false));
      }
  };

  return (
    <div className="login-page-container">
      {isLoading &&<Loader/>}
      <form className="login-auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="login-form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="login-error-text">{errors.email}</span>}
        </div>

        <div className="login-form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="login-error-text">{errors.password}</span>
          )}
        </div>

        <button type="submit" className="login-submit-btn">
          Login
        </button>
      </form>
    </div>
  );
}
