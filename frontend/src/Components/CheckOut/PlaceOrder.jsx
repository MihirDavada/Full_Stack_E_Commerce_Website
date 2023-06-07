import React, { useCallback, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Error from "../errorMessage/Error.jsx";
import CheckOutSteps from "./CheckOutSteps.jsx";
import { orderCreateActions } from "../../Store/orderCreateSlice.js";
import { cartActions } from "../../Store/cartSlice.js";
import { shippingActions } from "../../Store/shippingSlice.js";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";

const PlaceOrder = () => {
  const navigate = useNavigate();

  const latestOrderState = (state) => {
    return state.createOrder.order;
  };
  const order = useSelector(latestOrderState);

  const latestOrderIsLoadingState = (state) => {
    return state.createOrder.isLoading;
  };
  const isLoading = useSelector(latestOrderIsLoadingState);

  const latestOrderIsErrorState = (state) => {
    return state.createOrder.isError;
  };
  const isError = useSelector(latestOrderIsErrorState);

  const latestOrderSuccessState = (state) => {
    return state.createOrder.success;
  };
  const success = useSelector(latestOrderSuccessState);

  const latestShippingAddressState = (state) => {
    return state.shippingAdd.shippingAddress;
  };

  const shippingAddress = useSelector(latestShippingAddressState);

  const latestPaymentMethodState = (state) => {
    return state.shippingAdd.paymentMethod;
  };

  const payment = useSelector(latestPaymentMethodState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);

  const latestCartState = (state) => {
    return state.cart.cartItems;
  };

  const cartItems = useSelector(latestCartState);

  const dispatch = useDispatch();

  let itemsPrice = cartItems
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);
  let shippingPrice = (itemsPrice > 100 ? 0 : 10).toFixed(2);
  let taxPrice = Number(0.082 * itemsPrice).toFixed(2);

  let totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);


  const fetchOrderCreateHandler = useCallback(() => {
    dispatch(orderCreateActions.sendingRequest());

    const url = "/firstApp/orders/addOrderItems";

    let params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        orderItems: cartItems,
        paymentMethod: payment.paymentMethod,
        shippingAddress: shippingAddress,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
      }),
    };

    fetch(url, params)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((orderCreateData) => {
        // console.log(orderCreateData)

        dispatch(orderCreateActions.fetchOrderSuccessfully(orderCreateData));
      })
      .catch((error) => {
        dispatch(orderCreateActions.setTheError("Something Went Wrong"));
      });
  }, [
    dispatch,
    userInfo,
    cartItems,
    itemsPrice,
    payment,
    shippingAddress,
    shippingPrice,
    taxPrice,
    totalPrice,
  ]);

  const placeOrderHandler = (event) => {
    event.preventDefault()
    fetchOrderCreateHandler();
  };

  useEffect(() => {
    if(!userInfo){
      navigate('/login')
    }
    if (success) {
      navigate(`/order/${order._id}`)
      dispatch(orderCreateActions.resetTheOrder());
      dispatch(cartActions.CLEAR_CART());
      dispatch(shippingActions.CLEAR_PAYMENT_METHOD());
      dispatch(shippingActions.CLEAR_SHIPPING_ADDRESS());
    }
  }, [success, dispatch, order, navigate, userInfo]);

  let placeOrderContent = (
    <div>
      <CheckOutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>

              <p>
                <strong>Shipping: </strong>
                {shippingAddress.address}, {shippingAddress.city}
                {"  "}
                {shippingAddress.postalCode},{"  "}
                {shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {payment.paymentMethod}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartItems.length === 0 ? (
                <Error variant="info">Your cart is empty</Error>
              ) : (
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link style={{textDecoration:'none'}} to={`/productDetail/${item.product_slug}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Items:</Col>
                  <Col>${itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax:</Col>
                  <Col>${taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total:</Col>
                  <Col>${totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );

  if (isLoading) {
    placeOrderContent = <LoadingSpinner />;
  }
  if(isError){
    placeOrderContent = <Error variant = 'danger'> Something Went Wrong(Server Error) </Error>
  }
  return <>{placeOrderContent}</>;
};

export default PlaceOrder;
