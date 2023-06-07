import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "../../Store/cartSlice.js";
import Error from "../errorMessage/Error.jsx";

import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {

  const navigate = useNavigate()

  const dispatch = useDispatch();

  const latestCartState = (state) => {
    return state.cart.cartItems;
  };

  const cartItems = useSelector(latestCartState);

  let cartItemsContent = (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Error variant="info">
            Your cart is empty <Link to="/">Go Back</Link>
          </Error>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <>
                <ListGroup.Item key={item._id}>
                  <Row
                    className="shadow "
                    style={{
                      padding: "1rem",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={`/productDetail/${item.product_slug}`}
                      >
                        {item.name}
                      </Link>
                    </Col>

                    <Col md={2}>${item.price}</Col>

                    <Col md={3}>
                      <Form.Select
                        style={{ color: "white", backgroundColor: "black" }}
                        className="my-1"
                        as="select"
                        value={item.qty}
                        onChange={(event) => {
                          dispatch(
                            cartActions.ADD_TO_CART({
                              ...item,
                              qty: Number(event.target.value),
                            })
                          );
                        }}
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>

                    <Col md={1}>
                      <Button
                        style={{ color: "white", backgroundColor: "black" }}
                        className="my-1"
                        type="button"
                        variant="light"
                        onClick={() => {
                          dispatch(cartActions.REMOVE_FROM_CART(item._id));
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              </>
            ))}
          </ListGroup>
        )}
      </Col>

      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal (
                {cartItems.reduce(
                  (totalItems, item) => totalItems + item.qty,
                  0
                )}
                ) items
              </h2>
              $
              {cartItems
                .reduce(
                  (totalPrice, item) => totalPrice + item.qty * item.price,
                  0
                )
                .toFixed(2)}
            </ListGroup.Item>
          </ListGroup>

          <ListGroup.Item>
            <Button
              type="button"
              className="btn-block"
              disabled={cartItems.length === 0}
              onClick={() => {
                navigate('/shipping/')
              }}
            >
              Proceed To Checkout
            </Button>
          </ListGroup.Item>
        </Card>
      </Col>
    </Row>
  );
  return <>{cartItemsContent};</>;
};

export default Cart;
