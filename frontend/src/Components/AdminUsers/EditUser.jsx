import React, { useCallback, useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../Container/FormContainer.jsx";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Error from "../errorMessage/Error.jsx";
import { useNavigate } from "react-router-dom";
import { adminUserDetailAction } from "../../Store/adminUserDetailSlice.js";
import { adminUpdateUserAction } from "../../Store/adminUpdateUserSlice.js";

const EditUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const param = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const latestAdminUserDetailState = (state) => {
    return state.adminUserDetail.adminUserDetail;
  };
  const adminUserDetail = useSelector(latestAdminUserDetailState);

  const latestAdminUserIsLoadingState = (state) => {
    return state.adminUserDetail.isLoading;
  };
  const isLoading = useSelector(latestAdminUserIsLoadingState);

  const latestAdminUserIsErrorState = (state) => {
    return state.adminUserDetail.isError;
  };
  const isError = useSelector(latestAdminUserIsErrorState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);

  const latestUpdatedSuccessState = (state) => {
    return state.adminUpdatedUser.success;
  };

  const updatedSuccess = useSelector(latestUpdatedSuccessState);

  const latestUpdatedIsLoadingState = (state) => {
    return state.adminUpdatedUser.isLoading;
  };

  const updatedIsLoading = useSelector(latestUpdatedIsLoadingState);

  const latestUpdatedIsErrorState = (state) => {
    return state.adminUpdatedUser.isError;
  };

  const updatedIsError = useSelector(latestUpdatedIsErrorState);

  const fetchUserDataHandler = useCallback(() => {
    dispatch(adminUserDetailAction.sendingRequest());

    const url = `/firstApp/admin/getUser/${param.userId}`;

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
      .then((adminUserInfoData) => {
        dispatch(
          adminUserDetailAction.fetchUserInfoSuccessfully(adminUserInfoData)
        );
        console.log(adminUserInfoData);
        setName("");
        setEmail("");
      })
      .catch((error) => {
        dispatch(adminUserDetailAction.setTheError());
      });
  }, [dispatch, param, userInfo]);

  const fetchUpdatedDataHandler = useCallback(() => {
    dispatch(adminUpdateUserAction.sendingRequest());

    const url = `/firstApp/admin/updateUser/${param.userId}`;

    let params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        name: name,
        email: email,
        isAdmin: isAdmin,
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
        dispatch(
          adminUpdateUserAction.fetchUserInfoSuccessfully(updatedUserData)
        );
        dispatch(
          adminUserDetailAction.fetchUserInfoSuccessfully(updatedUserData)
        );
      })
      .catch((error) => {
        dispatch(adminUpdateUserAction.setTheError());
      });
  }, [dispatch, userInfo, email, name, isAdmin, param]);

  useEffect(() => {
    if (updatedSuccess) {
      dispatch(adminUpdateUserAction.resetUser());
      navigate('/admin/userList')
    }
    if (!adminUserDetail.name || adminUserDetail._id !== Number(param.userId)) {
      fetchUserDataHandler();
    } else {
      setName(adminUserDetail.name);
      setEmail(adminUserDetail.email);
      setIsAdmin(adminUserDetail.isAdmin);
    }
  }, [fetchUserDataHandler, adminUserDetail, param, dispatch, navigate, updatedSuccess]);

  const submitHandler = (event) => {
    event.preventDefault();
    fetchUpdatedDataHandler();
  };

  return (
    <div>
      <Link to="/admin/userList">
        {" "}
        <Button> Go Back</Button>
      </Link>

      <FormContainer>
        <h1>Edit User</h1>
        {updatedIsLoading && <LoadingSpinner />}
        {updatedIsError && <Error variant="danger">Something Went Wrong (Server Error)</Error>}

        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <Error variant="danger"> Something Went Wrong (Server Error) </Error>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="email" className="my-4">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="isAdmin" className="my-4">
              <Form.Check
                type="checkbox"
                label="Is Admin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              ></Form.Check>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-4">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default EditUser;
