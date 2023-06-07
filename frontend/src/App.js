import React from "react";
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import { Container } from "react-bootstrap";
import Products from "./Components/Products/Products.jsx";
import { Route, Routes } from "react-router-dom";
import ProductDetail from "./Components/ProductDetail/ProductDetail.jsx";
import CartDetail from "./Components/CartDetail/CartDetail.jsx";
import Cart from "./Components/CartDetail/Cart.jsx";
import Login from "./Components/Authentication/Login.jsx";
import SignUp from "./Components/Authentication/SignUp.jsx";
import UserProfile from "./Components/Authentication/UserProfile.jsx";
import ShippingInfo from "./Components/CheckOut/ShippingInfo.jsx";
import PaymentMethod from "./Components/CheckOut/PaymentMethod.jsx";
import PlaceOrder from './Components/CheckOut/PlaceOrder.jsx'
import OrderScreen from "./Components/CheckOut/OrderScreen.jsx";
import UserList from "./Components/AdminUsers/UserList.jsx";
import EditUser from "./Components/AdminUsers/EditUser.jsx";
import ProductList from "./Components/AdminUsers/ProductList.jsx";
import EditProduct from "./Components/AdminUsers/EditProduct.jsx";
import OrderList from "./Components/AdminUsers/OrderList.jsx";

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route path="" element={<Products />} />
            <Route path="productDetail/:productSlug" element={<ProductDetail/>} />
            <Route path="cartDetail/:productSlug" element={<CartDetail/>} />
            <Route path="cart/" element={<Cart/>} />
            <Route path="login/" element={<Login/>} />
            <Route path="register/" element={<SignUp/>} />
            <Route path="userProfile/" element={<UserProfile/>} />
            <Route path="shipping/" element={<ShippingInfo/>} />
            <Route path="payment/" element={<PaymentMethod/>} />
            <Route path="placeOrder/" element={<PlaceOrder/>} />
            <Route path="order/:orderId" element={<OrderScreen/>} />
            <Route path="admin/userList" element={<UserList/>} />
            <Route path="admin/user/:userId/edit" element={<EditUser/>} />
            <Route path="admin/productList" element={<ProductList/>} />
            <Route path="admin/product/:productId/edit" element={<EditProduct/>} />
            <Route path="admin/orderList/" element={<OrderList/>} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
