import React, { useCallback, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import FormContainer from "../Container/FormContainer.jsx";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Error from "../errorMessage/Error.jsx";
import { useNavigate } from "react-router-dom";
import { signUpAction } from "../../Store/signUpSlice.js";
import { authActions } from "../../Store/authSlice.js";

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const latestNewUserLoadingState = (state) => {
    return state.signUp.isLoading;
  };

  const isLoading = useSelector(latestNewUserLoadingState);

  const latestNewUserErrorState = (state) => {
    return state.signUp.isError;
  };

  const isError = useSelector(latestNewUserErrorState);


  const fetchDataHandler = useCallback( () => {
    dispatch(signUpAction.sendingRequest());

    const url = "/firstApp/user/register/";

    let params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      .then((newUserInfoData) => {
        dispatch(signUpAction.fetchUserInfoSuccessfully(newUserInfoData));
        dispatch(authActions.fetchUserInfoSuccessfully(newUserInfoData))
        if(newUserInfoData){
          navigate('/')
        }
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("")
      })
      .catch((error) => {
        dispatch(
          signUpAction.setTheError()
        );
      });
  }, [dispatch, email, name, password, navigate]);

  const submitHandler = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Password Does Not Match");
    }
    else{
        fetchDataHandler();
    }

  };

  let userContent = (
    <FormContainer>
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
            required
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
            required
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary" className="my-2">
          Sign Up
        </Button>
      </Form>

      <Row className="my-3">
        <Col>
          Do You Have Already Account?
          <Link to="/login">Login</Link>
        </Col>
      </Row>
    </FormContainer>
  );

  if (isLoading) {
    userContent = <LoadingSpinner />;
  }

  return (
    <>
      {message && <Error variant="danger"> {message}</Error>}
      {isError && <Error variant="danger"> This User Has Already Been Exist</Error>}
      {userContent}
    </>
  );
};

export default SignUp;
