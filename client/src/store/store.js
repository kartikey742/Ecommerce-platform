import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import addressReducer from "./addressSlice";
import shoppingOrderSlice from "./orderSlice";
const store=configureStore({
    reducer:{
        auth: authReducer, 
        address: addressReducer,
        shoppingOrder: shoppingOrderSlice
    }
})
export default store;