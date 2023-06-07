import React, { useCallback, useEffect } from "react";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Error from "../errorMessage/Error.jsx";
import { orderScreenActions } from "../../Store/orderScreenSlice.js";
import { orderPayActions } from "../../Store/orderPaySlice.js";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import { orderIsDeliveredActions } from "../../Store/orderIsDeliveredSlice.js";

const OrderScreen = () => {
  const navigate = useNavigate();

  const param = useParams();

  const dispatch = useDispatch();

  const latestOrderDetailState = (state) => {
    return state.orderDetail.orderDetails;
  };

  const orderDetail = useSelector(latestOrderDetailState);

  const latestIsLoadingState = (state) => {
    return state.orderDetail.isLoading;
  };

  const isLoading = useSelector(latestIsLoadingState);

  const latestIsErrorState = (state) => {
    return state.orderDetail.isError;
  };

  const isError = useSelector(latestIsErrorState);

  const latestIsErrorPayState = (state) => {
    return state.orderPay.isError;
  };

  const isErrorPay = useSelector(latestIsErrorPayState);

  const latestIsErrorDeliverState = (state) => {
    return state.orderIsDelivered.isError;
  };

  const isErrorDeliver = useSelector(latestIsErrorDeliverState);

  const latestIsLoadingPayState = (state) => {
    return state.orderPay.isLoading;
  };

  const isLoadingPay = useSelector(latestIsLoadingPayState);

  const latestIsLoadingDeliverState = (state) => {
    return state.orderIsDelivered.isLoading;
  };

  const isLoadingDeliver = useSelector(latestIsLoadingDeliverState);

  const latestIsSuccessPayState = (state) => {
    return state.orderPay.isLoading;
  };

  const isSuccessPay = useSelector(latestIsSuccessPayState);

  const latestIsSuccessDeliverState = (state) => {
    return state.orderIsDelivered.isLoading;
  };

  const isSuccessDeliver = useSelector(latestIsSuccessDeliverState);

  const latestpaymentResponseState = (state) => {
    return state.orderPay.paymentResponse;
  };

  const paymentResponse = useSelector(latestpaymentResponseState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);

  let itemsPrice;

  const fetchOrderCreateHandler = useCallback(() => {
    dispatch(orderScreenActions.sendingRequest());

    const url = `/firstApp/order/${param.orderId}`;

    let params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${userInfo.token}`,
      },
    };

    fetch(url, params)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((orderDetailData) => {
        dispatch(orderScreenActions.fetchOrderDetailfully(orderDetailData));
      })
      .catch((error) => {
        dispatch(orderScreenActions.setTheError("Something Went Wrong"));
      });
  }, [dispatch, userInfo, param]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (
      !orderDetail ||
      isSuccessPay ||
      orderDetail._id !== Number(param.orderId) ||
      isSuccessDeliver
    ) {
      dispatch(orderPayActions.resetThePay());
      dispatch(orderIsDeliveredActions.resetTheDeliver());
      fetchOrderCreateHandler();
    }
  }, [
    fetchOrderCreateHandler,
    isSuccessPay,
    navigate,
    userInfo,
    param,
    dispatch,
    orderDetail,
    isSuccessDeliver,
  ]);

  if (!isLoading && !isError) {
    itemsPrice = orderDetail.orderItems
      .reduce((sum, item) => sum + item.price * item.qty, 0)
      .toFixed(2);
  }

  const fetchPaymentDetailHandler = useCallback(() => {
    dispatch(orderPayActions.sendingRequest());

    const url = `/firstApp/order/${param.orderId}/isPaid`;

    let params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${userInfo.token}`,
      },
    };

    fetch(url, params)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((orderPayResault) => {
        dispatch(orderPayActions.fetchOrderPayDetailfully(orderPayResault));
      })
      .catch((error) => {
        dispatch(orderPayActions.setTheError("Something Went Wrong"));
      });
  }, [dispatch, userInfo, param]);

  const fetchDeliverDetailHandler = useCallback(() => {
    dispatch(orderIsDeliveredActions.sendingRequest());

    const url = `/firstApp/order/${param.orderId}/isDelivered`;

    let params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${userInfo.token}`,
      },
    };

    fetch(url, params)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((orderDeliverResault) => {
        dispatch(
          orderIsDeliveredActions.fetchOrderDeliverDetailfully(
            orderDeliverResault
          )
        );
      })
      .catch((error) => {
        dispatch(orderIsDeliveredActions.setTheError("Something Went Wrong"));
      });
  }, [dispatch, userInfo, param]);

  const paymentHandler = () => {
    fetchPaymentDetailHandler();
  };

  const deliverHandler = () => {
    fetchDeliverDetailHandler();
  };

  let placeOrderContent = <LoadingSpinner />;

  if (!isLoading) {
    placeOrderContent = (
      <div>
        <h1>Order: {param.orderId}</h1>
        <Row>
          <Col md={8}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {orderDetail.user.name}
                </p>
                <p>
                  <strong>Email: </strong>
                  <a href={`mailto:${orderDetail.user.email}`}>
                    {orderDetail.user.email}
                  </a>
                </p>

                <p>
                  <strong>Shipping: </strong>
                  {orderDetail.shippingAddress.address},{" "}
                  {orderDetail.shippingAddress.city}
                  {"  "}
                  {orderDetail.shippingAddress.postalCode},{"  "}
                  {orderDetail.shippingAddress.country}
                </p>

                {orderDetail.isDelivered ? (
                  <Error variant="success">
                    {" "}
                    Delivered on {orderDetail.deliveredAt}
                  </Error>
                ) : (
                  <Error variant="warning">Not Delivered</Error>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {orderDetail.paymentMethod}
                </p>
                {orderDetail.isPaid ? (
                  <Error variant="success">Paid on {orderDetail.paidAt}</Error>
                ) : (
                  <Error variant="warning">Not Paid</Error>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>
                {orderDetail.orderItems.length === 0 ? (
                  <Error variant="info">Your cart is empty</Error>
                ) : (
                  <ListGroup variant="flush">
                    {orderDetail.orderItems.map((item, index) => (
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

                          <Col>{item.name}</Col>

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
                    <Col>${orderDetail.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax:</Col>
                    <Col>${orderDetail.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Total:</Col>
                    <Col>${orderDetail.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>

                {isLoadingPay && <LoadingSpinner />}
                {isErrorPay && (
                  <Error variant="danger">
                    {" "}
                    Something Went Wrong(Server Error){" "}
                  </Error>
                )}
                {paymentResponse && (
                  <Error variant="success"> {paymentResponse} </Error>
                )}
                {!orderDetail.isPaid && (
                  <ListGroup.Item>
                    <Row>
                      <Button onClick={paymentHandler}>Make Payment</Button>
                    </Row>
                  </ListGroup.Item>
                )}
              </ListGroup>
              { isLoadingDeliver && <LoadingSpinner />}
              { isErrorDeliver && <Error variant='danger'> Something Went Wrong(Server Error) </Error>}
              {userInfo &&
                userInfo.isAdmin &&
                orderDetail.isPaid &&
                !orderDetail.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  if (isError) {
    placeOrderContent = (
      <Error variant="danger"> Something Went Wrong( Server Error) </Error>
    );
  }
  return <>{placeOrderContent}</>;
};

export default OrderScreen;
