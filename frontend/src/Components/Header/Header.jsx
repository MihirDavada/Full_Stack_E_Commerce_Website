import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../Store/authSlice";
import { userProfileAction } from "../../Store/userProfileSlice.js";
import { myOrderActions } from "../../Store/myOrderSlice.js";
import { userListAction } from "../../Store/userListSlice";
import SearchBox from "../SearchBox/SearchBox.jsx";

const Header = () => {
  const dispatch = useDispatch();

  const latestCartState = (state) => {
    return state.cart.cartItems;
  };

  const cartItems = useSelector(latestCartState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);

  const logOutHandler = () => {
    dispatch(authActions.UserLogOut());
    dispatch(userProfileAction.logOutHandler());
    dispatch(myOrderActions.resetTheOrders());
    dispatch(userListAction.resetUser());
  };

  let userContent = (
    <LinkContainer to="/login" style={{ textDecoration: "none" }}>
      <Nav.Link>
        <i className="fas fa-user"></i>Login
      </Nav.Link>
    </LinkContainer>
  );

  if (userInfo) {
    userContent = (
      <NavDropdown title={userInfo.name} id="username">
        <LinkContainer to="/userProfile">
          <NavDropdown.Item>Profile</NavDropdown.Item>
        </LinkContainer>

        <NavDropdown.Item onClick={logOutHandler}>LogOut</NavDropdown.Item>
      </NavDropdown>
    );
  }

  return (
    <header>
      <Navbar
        className="nav"
        bg="dark"
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <Link to="" style={{ textDecoration: "none" }}>
            <Navbar.Brand> ProShop.com </Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="mr-auto my-2 my-lg-0"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <LinkContainer to="/cart" style={{ textDecoration: "none" }}>
                <Nav.Link className="white">
                  <i className="fas fa-shopping-cart"></i>Cart(
                  {cartItems.reduce(
                    (totalItems, item) => totalItems + item.qty,
                    0
                  )}
                  )
                </Nav.Link>
              </LinkContainer>
              {userContent}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="adminmenue">
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>

              )}
                <SearchBox/>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
