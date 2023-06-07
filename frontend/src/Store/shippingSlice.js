import { createSlice } from "@reduxjs/toolkit";

const shippingAddressFromLocalStorage = localStorage.getItem("shippingInfo")
  ? JSON.parse(localStorage.getItem("shippingInfo"))
  : { address: "", city: "", postalCode: "", country: "" };

const paymentMethodFromLocalStorage = localStorage.getItem("paymentMethod")
  ? JSON.parse(localStorage.getItem("paymentMethod"))
  : {};

const initialState = {
  shippingAddress: shippingAddressFromLocalStorage,
  paymentMethod: paymentMethodFromLocalStorage,
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState: initialState,
  reducers: {
    ADD_SHIPPING_ADDRESS(state, action) {
      state.shippingAddress = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },
    ADD_PAYMENT_METHOD(state, action) {
      state.paymentMethod = action.payload;
      localStorage.setItem("paymentMethod", JSON.stringify(action.payload));
    },
    CLEAR_SHIPPING_ADDRESS(state, action){
      state.shippingAddress = { address: "", city: "", postalCode: "", country: "" }
      localStorage.removeItem("shippingInfo")
    },
    CLEAR_PAYMENT_METHOD(state, action){
      state.paymentMethod = {}
      localStorage.removeItem("paymentMethod")
    }
  },
});

export default shippingSlice;

export const shippingActions = shippingSlice.actions;
