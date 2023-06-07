import React, { useCallback, useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../Container/FormContainer.jsx";
import { Link } from "react-router-dom";
import { authActions } from "../../Store/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Error from "../errorMessage/Error.jsx";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const latestUserLoadingState = (state) => {
    return state.auth.isLoading;
  };
  
  const isLoading = useSelector(latestUserLoadingState);

  const latestUserErrorState = (state) => {
    return state.auth.isError;
  };

  const isError = useSelector(latestUserErrorState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);

  const fetchDataHandler = useCallback( () => {
    dispatch(authActions.sendingRequest());

    const url = "/firstApp/user/login";

    let params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
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
      .then((userInfoData) => {
        // console.log(userInfoData);
        dispatch(authActions.fetchUserInfoSuccessfully(userInfoData));
        setEmail("");
        setPassword("");
        if(userInfoData){
          navigate('/')
        }
      })
      .catch((error) => {
        dispatch(authActions.setTheError('No active Account found with this given credentials'));
      });
  },[dispatch, email, navigate, password]);

  const submitHandler = (event) => {
    event.preventDefault();
    fetchDataHandler();
  };

  useEffect( ()=>{

    if(userInfo){
      navigate('/')
    }

  }, [userInfo, navigate])

  let userContent = (
    <FormContainer>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email" className="my-2">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            required
            type="text"
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
            required
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-2">
          Sign In
        </Button>
      </Form>

      <Row className="my-3">
        <Col>
          New Customer?
          <Link to="/register">Register</Link>
        </Col>
      </Row>
    </FormContainer>
  );

  if (isLoading) {
    userContent = <LoadingSpinner />;
  }

  return <>
  {isError && <Error variant = 'danger'> No active Account found with this given credentials </Error>}
  {userContent}
  </>;
};

export default Login;
