import React from "react";
import { Card } from "react-bootstrap";
import Rating from "../Rating/Rating.jsx";
import { Link } from "react-router-dom";

const ProductItem = (props) => {
  return (
    <Card className="my-3 p-3 rounded shadow">
      <Link to={`/productDetail/${props.product.product_slug}`} style={{textDecoration : 'none'}}>
        <Card.Img variant="top" src={props.product.image} />
      </Link>
      <Card.Body>
        <Link to={`/productDetail/${props.product.product_slug}`} style={{textDecoration : 'none'}}>
          <Card.Title as="div">
            <strong>{props.product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={props.product.rating}
              text={`${props.product.numReviews} reviews`}
              color="#f8e825"
            />
          </div>
        </Card.Text>

        <Card.Text as="h3">${props.product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProductItem;
