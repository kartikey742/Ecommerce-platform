import {  useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../css/register.css'


export const Register = () => {
  const [formData, setFormData] = useState({
fullName: "",
email: "",
userName:"",
password: "",
confirmPassword: "",
role: "consumer",
terms: false,
});

const navigate=useNavigate();
const [errors, setErrors] = useState({});


const handleChange = (e) => {
  console.log(e.target);
  
const { name, value, type, checked } = e.target;
setFormData({
...formData,
[name]: type === "checkbox" ? checked : value,
});
};


const validate = () => {
let newErrors = {};
if (!formData.fullName || formData.fullName.length < 2) {
newErrors.fullName = "Full name must be at least 2 characters";
}
if (!formData.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
newErrors.email = "Enter a valid email";
}
if (!formData.password || formData.password.length < 8) {
newErrors.password = "Password must be at least 8 characters";
}
if (formData.password !== formData.confirmPassword) {
newErrors.confirmPassword = "Passwords do not match";
}
if (!formData.userName) {
newErrors.userName = "Enter a valid userName";
}
if (!formData.terms) {
newErrors.terms = "You must accept the terms";
}
setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};


const handleSubmit =async (e) => {
  e.preventDefault();
 
  
  if (validate()) {
    try {
      
      const response = await fetch(process.env.REACT_APP_BASE_URL+"/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), 
      });

      
      const data = await response.json();
    if(data.success){
      navigate('/auth/login');
    }
    } catch (error) {
      console.error("Network error:", error);
      alert("Something went wrong!");
    }
  }

};
 return (
<div className="register-page-container">
<form onSubmit={handleSubmit} className="register-auth-form" method='POST'>
<h2>Register</h2>
<div className="register-form-group">
<label>Full Name</label>
<input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
{errors.fullName && <div className="register-error-text">{errors.fullName}</div>}
</div>


<div className="register-form-group">
<label>Email</label>
<input type="email" name="email" value={formData.email} onChange={handleChange} />
{errors.email && <div className="register-error-text">{errors.email}</div>}
</div>

<div className="register-form-group">
<label>User Name</label>
<input type="text" name="userName" value={formData.userName} onChange={handleChange} />
{errors.UserName && <div className="register-error-text">{errors.userName}</div>}
</div>


<div className="register-form-group">
<label>Password</label>
<input type="password" name="password" value={formData.password} onChange={handleChange} />
{errors.password && <div className="register-error-text">{errors.password}</div>}
</div>


<div className="register-form-group">
<label>Confirm Password</label>
<input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
{errors.confirmPassword && <div className="register-error-text">{errors.confirmPassword}</div>}
</div>


<div className="register-form-group">
<label>Role</label>
<select name="role" value={formData.role} onChange={handleChange}>
<option value="student">consumer</option>
<option value="instructor">admin</option>
</select>
</div>


<div className="register-form-group">
<label>
<input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
<span>I agree to the Terms & Conditions</span>
</label>
{errors.terms && <div className="register-error-text">{errors.terms}</div>}
</div>


<button type="submit" className="register-submit-btn">Register</button>
</form>
</div>
);
}
