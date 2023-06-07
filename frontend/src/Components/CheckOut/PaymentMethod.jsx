import React, { useEffect, useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../Container/FormContainer.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { shippingActions } from "../../Store/shippingSlice.js";
import CheckOutSteps from "./CheckOutSteps.jsx";

const PaymentMethod = () => {
  const latestShippingAddressState = (state) => {
    return state.shippingAdd.shippingAddress;
  };

  const shippingAddress = useSelector(latestShippingAddressState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);


  const navigate = useNavigate()

  if (!shippingAddress.address) {
    navigate('/shipping')
  }

  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  useEffect( ()=>{
    if(!userInfo){
      navigate('/login')
    }
  })


  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(shippingActions.ADD_PAYMENT_METHOD({paymentMethod}))
    navigate('/placeOrder')
  };

  return (
    <>

    
      <CheckOutSteps step1 step2 step3 />
    <FormContainer>
      <Form onSubmit={submitHandler}>


        <Form.Group className="py-2" style={{width:"200px"}}>
          <Form.Label as="legend" className="my-2">Select Method</Form.Label>
          <Col className="py-4" >
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="paypal"
              name="paymentMethod"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check>

          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
    </>
  );
};

export default PaymentMethod;
