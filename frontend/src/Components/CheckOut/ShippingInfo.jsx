import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../Container/FormContainer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { shippingActions } from "../../Store/shippingSlice.js";
import CheckOutSteps from "./CheckOutSteps.jsx";
const ShippingInfo = () => {

  const latestShippingAddressState = (state) => {
    return state.shippingAdd.shippingAddress;
  };

  const shippingAddress = useSelector(latestShippingAddressState);
  // console.log(shippingAddress)

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);


  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city );
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect( ()=>{
    if(!userInfo){
      navigate('/login')
    }
  })


  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(
      shippingActions.ADD_SHIPPING_ADDRESS({ address, city, postalCode, country })
    );
    navigate("/payment");
  };

  return (
    <>

    <CheckOutSteps step1 = "true" step2 = "true" />
    <FormContainer>
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address" className="my-2">
          <Form.Label>Address</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter address"
            value={address ? address : ""}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city" className="my-2">
          <Form.Label>City</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter city"
            value={city ? city : ""}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode" className="my-2">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter postal code"
            value={postalCode ? postalCode : ""}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country" className="my-2">
          <Form.Label>Country</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter country"
            value={country ? country : ""}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
    </>
  );
};

export default ShippingInfo;
