import React, { useState } from "react";

import { useSelector } from "react-redux";
import { setIsAuthenticated, setUser } from "../../store/authSlice";
import { useDispatch } from "react-redux";
export  function Login() {
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
      if(data.success){
        dispatch(setUser(data.user));
        dispatch(setIsAuthenticated(true));
      }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Login
        </button>
      </form>
    </div>
  );
}
