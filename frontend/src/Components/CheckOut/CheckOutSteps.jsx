import React from "react";
import { Button, Nav , NavLink} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckOutSteps = (props) => {
  return (
    <Nav className="mb-4 navCen">
      <Nav.Item>
        {props.step1 ? (
          <LinkContainer to="/login">
            <NavLink > <Button > Login </Button> </NavLink>
          </LinkContainer>
        ) : (
          <NavLink disabled>Login</NavLink>
        )}
      </Nav.Item>

      <Nav.Item>
        {props.step2 ? (
          <LinkContainer to="/shipping">
            <NavLink > <Button>Shipping</Button></NavLink>
          </LinkContainer>
        ) : (
          <NavLink disabled>Shipping</NavLink>
        )}
      </Nav.Item>

      <Nav.Item>
        {props.step3 ? (
          <LinkContainer to="/payment">
            <NavLink> <Button> Payment </Button></NavLink>
          </LinkContainer>
        ) : (
          <NavLink disabled>Payment</NavLink>
        )}
      </Nav.Item>

      <Nav.Item>
        {props.step4 ? (
          <LinkContainer to="/placeorder">
            <NavLink > <Button>Place Order</Button></NavLink>
          </LinkContainer>
        ) : (
          <NavLink disabled>Place Order</NavLink>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckOutSteps;
