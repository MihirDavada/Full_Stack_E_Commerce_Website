import React, { useCallback, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Error from "../errorMessage/Error.jsx";
import { useNavigate } from "react-router-dom";
import { adminOrderListAction } from "../../Store/adminOrderListSlice.js";

const OrderList = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const latestOrderIsLoadingState = (state) => {
    return state.adminOrderList.isLoading;
  };
  const isLoading = useSelector(latestOrderIsLoadingState);

  const latestOrderIsErrorState = (state) => {
    return state.adminOrderList.isError;
  };
  const isError = useSelector(latestOrderIsErrorState);

  const latestOrderState = (state) => {
    return state.adminOrderList.adminOrderList;
  };

  const orders = useSelector(latestOrderState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);

  const fetchDataHandler = useCallback(() => {
    dispatch(adminOrderListAction.sendingRequest());

    const url = "/firstApp/admin/getOrders/";

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
      .then((orderListData) => {
        // console.log(usersData);
        dispatch(
          adminOrderListAction.fetchOrderListSuccessfully(orderListData)
        );
      })
      .catch((error) => {
        dispatch(
          adminOrderListAction.setTheError(
            "No active Account found with this given credentials"
          )
        );
      });
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchDataHandler();
    } else {
      navigate("/login");
    }
  }, [fetchDataHandler, userInfo, navigate]);

  return (
    <>
      <h1> Order </h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Error variant="danger"> Something Went Wrong </Error>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>Total</th>
              <th>PAID</th>
              <th>DELIVERED</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>

                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-check" style={{ color: "red" }}></i>
                  )}
                </td>

                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className="fas fa-check" style={{ color: "red" }}></i>
                  )}
                </td>

                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderList;
