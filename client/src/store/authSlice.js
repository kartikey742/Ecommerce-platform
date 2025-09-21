import {createSlice} from "@reduxjs/toolkit";
const initalState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,};

  const authSlice = createSlice({
    name: "auth",
    initialState: initalState,  
    reducers: {
        setUser: (state, action) => {  
          state.user = action.payload;
          state.isLoading = false;
          console.log(state.isLoading);
        },
        setIsAuthenticated: (state, action) => {
          state.isAuthenticated = action.payload;
        },
        setIsLoading: (state, action) => {
          state.isLoading = action.payload;
        }
    }
})
export const {setUser,setIsLoading,setIsAuthenticated} = authSlice.actions;
export default authSlice.reducer;