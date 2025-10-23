import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  addressList: [],
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAddressList: (state, action) => {
      state.addressList = action.payload;
    },
    addAddress: (state, action) => {
      state.addressList.push(action.payload);
    },
    removeAddress: (state, action) => {
      state.addressList = state.addressList.filter(
        (addr) => addr.id !== action.payload
      );
    },
    clearAddresses: (state) => {
      state.addressList = [];
    },
  },
});

export const {
  setLoading,
  setAddressList,
  addAddress,
  removeAddress,
  clearAddresses,
} = addressSlice.actions;

export default addressSlice.reducer;
