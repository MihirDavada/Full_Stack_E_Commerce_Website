import { createSlice } from "@reduxjs/toolkit";

const cartItemsFromLocalStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')):[];

const initialState = { cartItems: cartItemsFromLocalStorage};

const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    ADD_TO_CART(state, action) {
      
      const existingItemIndex = state.cartItems.findIndex((items) => {
        return items._id === action.payload._id;
      });
      
      const existingItem = state.cartItems[existingItemIndex];
      
      let updatedItem;
      let updatedItems = [...state.cartItems]; //It copies All the Previous Items of the array in updatedItems
      
      if (existingItem) {
        updatedItem = {
          ...existingItem,
          qty: action.payload.qty,
        };
        
        updatedItems[existingItemIndex] = updatedItem;
      } else {
        updatedItems = state.cartItems.concat(action.payload);
      }
      
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      
      return {
        cartItems: updatedItems,
      };
    },
    REMOVE_FROM_CART(state, action) {
      const deleteItemIndex = state.cartItems.findIndex((items) => {
        return items._id === action.payload;
      });
      const deleteItem = state.cartItems[deleteItemIndex];
      
      let updatedItem;
      let updatedItems = [...state.cartItems]; //It copies All the Previous Items of the array in updatedItems
      
      if (deleteItem.qty === 1) {
        updatedItems = state.cartItems.filter((item) => {
          return item._id !== action.payload;
        });
      } 
      else 
      {
        updatedItem = {
          ...deleteItem,
          qty: deleteItem.qty - 1,
        };
        updatedItems[deleteItemIndex] = updatedItem;
      }
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return {
        cartItems: updatedItems,
      };
    },
    CLEAR_CART(state, action){
      state.cartItems = []
      localStorage.removeItem("cartItems")
    }
  },
});

export default cartSlice;

export const cartActions = cartSlice.actions;
