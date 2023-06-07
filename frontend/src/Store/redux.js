import { configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice.js";
import cartSlice from "./cartSlice.js";
import authSlice from "./authSlice.js";
import signUpSlice from "./signUpSlice.js";
import userProfileSlice from "./userProfileSlice.js";
import updateUserSlice from "./updateUserSlice.js";
import shippingSlice from "./shippingSlice.js";
import orderCreateSlice from "./orderCreateSlice.js";
import orderScreenSlice from "./orderScreenSlice.js";
import orderPaySlice from "./orderPaySlice.js";
import myOrderSlice from "./myOrderSlice.js";
import userListSlice from "./userListSlice.js";
import userDeleteSlice from "./userDeleteSlice.js";
import adminUserDetailSlice from "./adminUserDetailSlice.js";
import adminUpdateUserSlice from "./adminUpdateUserSlice.js";
import adminDeleteProductSlice from "./adminDeleteProductSlice.js";
import adminCreatedProductSlice from "./adminCreateProductSlice.js";
import productDetailsByIdSlice from "./productDetailByIdSlice.js";
import adminUpdateProductSlice from "./adminUpdateProductSlice.js";
import adminOrderListSlice from "./adminOrderListSlice.js";
import orderIsDeliveredSlice from "./orderIsDeliveredSlice.js";
import createProductReviewSlice from "./createProductReviewSlice.js";
import topProductSlice from "./topProductSlice.js";

const store = configureStore({
  reducer: {
    products: productSlice.reducer,
    cart: cartSlice.reducer,
    auth: authSlice.reducer,
    signUp: signUpSlice.reducer,
    userProfile:userProfileSlice.reducer,
    updatedUser : updateUserSlice.reducer,
    shippingAdd : shippingSlice.reducer,
    createOrder : orderCreateSlice.reducer,
    orderDetail: orderScreenSlice.reducer,
    orderPay: orderPaySlice.reducer,
    myOrder:myOrderSlice.reducer,
    users:userListSlice.reducer,
    deleteUser:userDeleteSlice.reducer,
    adminUserDetail : adminUserDetailSlice.reducer,
    adminUpdatedUser: adminUpdateUserSlice.reducer,
    adminDeleteProduct:adminDeleteProductSlice.reducer,
    adminCreatedProduct: adminCreatedProductSlice.reducer,
    productDetailsById:productDetailsByIdSlice.reducer,
    adminUpdateProduct:adminUpdateProductSlice.reducer,
    adminOrderList : adminOrderListSlice.reducer,
    orderIsDelivered : orderIsDeliveredSlice.reducer,
    createProductReview: createProductReviewSlice.reducer,
    topProducts:topProductSlice.reducer
  },
});

export default store;
