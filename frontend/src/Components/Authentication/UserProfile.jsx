import React, { useCallback, useEffect, useState } from "react";
import { Form, Button, Row, Col, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Error from "../errorMessage/Error.jsx";
import { useNavigate } from "react-router-dom";
import { userProfileAction } from "../../Store/userProfileSlice.js";
import { updateUserAction } from "../../Store/updateUserSlice.js";
import { authActions } from "../../Store/authSlice.js";
import { myOrderActions } from "../../Store/myOrderSlice.js";

const UserProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const latestUserProfileLoadingState = (state) => {
    return state.userProfile.isLoading;
  };
  const isLoading = useSelector(latestUserProfileLoadingState);

  const latestUserUpdatedLoadingState = (state) => {
    return state.updatedUser.isLoading;
  };
  const updatedIsLoading = useSelector(latestUserUpdatedLoadingState);

  const latestMyOrderLoadingState = (state) => {
    return state.myOrder.isLoading;
  };
  const myOrderIsLoading = useSelector(latestMyOrderLoadingState);

  const latestUserProfileErrorState = (state) => {
    return state.userProfile.isError;
  };
  const isError = useSelector(latestUserProfileErrorState);

  const latestUserUpdateErrorState = (state) => {
    return state.updatedUser.isError;
  };
  const updatedIsError = useSelector(latestUserUpdateErrorState);

  const latestMyOrderErrorState = (state) => {
    return state.myOrder.isError;
  };
  const myOrderIsError = useSelector(latestMyOrderErrorState);

  const latestUserProfileState = (state) => {
    return state.userProfile.user;
  };
  const user = useSelector(latestUserProfileState);

  const latestUserSuccessState = (state) => {
    return state.updatedUser.success;
  };
  const success = useSelector(latestUserSuccessState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };
  const userInfo = useSelector(latestUserInfoState);

  const latestAllOrderState = (state) => {
    return state.myOrder.myOrders;
  };
  const allOrders = useSelector(latestAllOrderState);

  const fetchDataHandler = useCallback(() => {
    dispatch(userProfileAction.sendingRequest());

    const url = "/firstApp/user/profile";

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
      .then((userProfileData) => {
        dispatch(userProfileAction.fetchUserInfoSuccessfully(userProfileData));
      })
      .catch((error) => {
        dispatch(
          userProfileAction.setTheError(
            "No active Account found with this given credentials"
          )
        );
      });
  }, [dispatch, userInfo]);

  const fetchOrdersHandler = useCallback(() => {
    dispatch(myOrderActions.sendingRequest());

    const url = "/firstApp/orders/getAllOrders";

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
      .then((myOrdersData) => {
        dispatch(myOrderActions.fetchMyOrdersDetailfully(myOrdersData));
      })
      .catch((error) => {
        dispatch(myOrderActions.setTheError("Something Went Wrong"));
      });
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (!userInfo || userInfo.token == null) {
      navigate("/login");
    } else {
      if (!user || !user.name || success) {
        dispatch(updateUserAction.resetUser());
        fetchDataHandler();
        fetchOrdersHandler();
      } else {
        setName(user.name);
        setEmail(user.email);
      }
      fetchOrdersHandler();
    }
  }, [
    fetchDataHandler,
    fetchOrdersHandler,
    user,
    navigate,
    userInfo,
    dispatch,
    success,
  ]);

  const fetchUpdatedDataHandler = useCallback(() => {
    dispatch(updateUserAction.sendingRequest());

    const url = "/firstApp/user/updateProfile";

    let params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    };

    fetch(url, params)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((updatedUserData) => {
        dispatch(updateUserAction.fetchUserInfoSuccessfully(updatedUserData));
        dispatch(authActions.fetchUserInfoSuccessfully(updatedUserData));
      })
      .catch((error) => {
        dispatch(updateUserAction.setTheError("Something Went Wrong"));
      });
  }, [dispatch, userInfo, email, name, password]);

  const submitHandler = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Password Does Not Match");
    } else {
      fetchUpdatedDataHandler();
      setErr(true);
    }
  };

  let userProfileContent = (
    <Form onSubmit={submitHandler}>
      <Form.Group controlId="name" className="my-2">
        <Form.Label>Name</Form.Label>
        <Form.Control
          required
          type="name"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId="email" className="my-2">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          required
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId="password" className="my-2">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId="confirmPassword" className="my-2">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
          }}
        ></Form.Control>
      </Form.Group>

      <Button type="submit" variant="primary" className="my-2">
        Update
      </Button>
    </Form>
  );

  if (isLoading || updatedIsLoading) {
    userProfileContent = <LoadingSpinner />;
  }

  if (updatedIsError || isError) {
    <Error variant="danger"> Something Went Wrong </Error>;
  }

  return (
    <Row>
      <Col md={3}>
        <h2> User Profile </h2>
        {err && <Error variant="success"> Profile Get Updated </Error>}
        {message && <Error variant="danger"> {message}</Error>}
        {userProfileContent}
      </Col>

      <Col md={9}>
        <h2> My Orders </h2>
        {myOrderIsLoading ? (
          <LoadingSpinner />
        ) : myOrderIsError ? (
          <Error variant="danger"> Something Went Wrong </Error>
        ) : (
          <Table striped responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm">Details</Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default UserProfile;
