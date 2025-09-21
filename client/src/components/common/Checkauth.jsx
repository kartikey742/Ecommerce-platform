import { Navigate, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
function CheckAuth({ isAuthenticated, user, children }) {
  const isLoading = useSelector((state) => state.auth.isLoading);
  const location = useLocation();

  console.log(location.pathname, isAuthenticated);

if(isLoading){
  return <div>Loading...</div>;
}

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
    
  ) {
    console.log('here')
    return <Navigate to="/auth/login" />;
  }

  if (
    isAuthenticated &&
    (location.pathname.includes("/login") ||
      location.pathname.includes("/register"))
  ) {
    
    
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (
    isAuthenticated &&
    user?.role !== "admin" &&
    location.pathname.includes("admin")
  ) {
    return <Navigate to="/unauth-page" />;
  }

  if (
    isAuthenticated &&
    user?.role === "admin" &&
    location.pathname.includes("shop")
    
  ) {

    return <Navigate to="/admin/dashboard" />;
  }
console.log('reached last');
console.log({children});

  return <>{children}</>;
}

export default CheckAuth;