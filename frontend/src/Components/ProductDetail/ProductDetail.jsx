import React, { useCallback, useEffect, useState } from "react";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Rating from "../Rating/Rating.jsx";
import Error from "../errorMessage/Error.jsx";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../Store/productSlice.js";
import { createProductReviewAction } from "../../Store/createProductReviewSlice.js";

const ProductDetail = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [review, setReview] = useState(false);
  const [response, setResponse] = useState("");

  const navigate = useNavigate();

  const qtyHandler = (event) => {
    setQty(event.target.value);
  };

  const latestLoadingState = (state) => {
    return state.products.isLoading;
  };

  const isLoading = useSelector(latestLoadingState);

  const latestErrorState = (state) => {
    return state.products.isError;
  };

  const isError = useSelector(latestErrorState);

  const latestProductDetailState = (state) => {
    return state.products.productDetail;
  };

  const productDetail = useSelector(latestProductDetailState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };
  const userInfo = useSelector(latestUserInfoState);

  const latestCreateProductReviewLoadingState = (state) => {
    return state.createProductReview.isLoading;
  };

  const reviewIsLoading = useSelector(latestCreateProductReviewLoadingState);

  const latestCreateProductReviewErrorState = (state) => {
    return state.createProductReview.isError;
  };

  const reviewIsError = useSelector(latestCreateProductReviewErrorState);

  const latestCreateProductReviewSuccessState = (state) => {
    return state.createProductReview.success;
  };

  const reviewIsSuccess = useSelector(latestCreateProductReviewSuccessState);

  let arr = [];

  for (let index = 1; index <= productDetail.countInStock; index++) {
    arr.push(index);
  }

  const dispatch = useDispatch();

  const param = useParams();
  const url = `/firstApp/productDetail/${param.productSlug}`;

  const fetchDataHandler = useCallback(() => {
    dispatch(productActions.sendingRequest());

    let params = {
      method: "GET",
    };
    fetch(url, params)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something Went wrong...!!");
        }
        return response.json();
      })
      .then((productDetailData) => {
        dispatch(
          productActions.fetchProductDetailSuccessfully(productDetailData)
        );
      })
      .catch((error) => {
        dispatch(productActions.setTheError());
      });
  }, [url, dispatch]);

  useEffect(() => {
    if (reviewIsSuccess) {
      setRating(0);
      setComment("");
      dispatch(createProductReviewAction.reset());
    }
    else{
      fetchDataHandler();
    }

  }, [fetchDataHandler, reviewIsSuccess, dispatch]);

  const addToCartHandler = () => {
    navigate(`/cartDetail/${param.productSlug}?qty=${qty}`);
  };

  const fetchReviewHandler = useCallback(() => {
    dispatch(createProductReviewAction.sendingRequest());

    const url = `/firstApp/reviews/${param.productSlug}/rating`;

    let params = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        rating: rating,
        comment: comment,
      }),
    };

    fetch(url, params)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((reviewData) => {
        dispatch(createProductReviewAction.createProductReviewSuccessfully());
        setResponse(reviewData);
      })
      .catch((error) => {
        dispatch(createProductReviewAction.setTheError());
      });
  }, [dispatch, userInfo, param, comment, rating]);

  const submitHandler = (event) => {
    event.preventDefault();
    fetchReviewHandler();
  };

  let productDetailContent = (
    <div>
      <Link to="/" className="btn btn-dark my-3">
        Go Back
      </Link>

      <Row>
        <Col md={6}>
          <Image src={productDetail.image} alt={productDetail.name} fluid />
        </Col>

        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{productDetail.name}</h3>
            </ListGroup.Item>

            <ListGroup.Item>
              <Rating
                value={productDetail.rating}
                text={`${productDetail.numReviews} reviews`}
                color="#f8e825"
              />
            </ListGroup.Item>

            <ListGroup.Item>Price = ${productDetail.price}</ListGroup.Item>

            <ListGroup.Item>
              Description = ${productDetail.description}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price</Col>
                  <Col>
                    <strong> ${productDetail.price} </strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {productDetail.countInStock > 0
                      ? "In Stocks"
                      : "Out Of Stocks"}
                  </Col>
                </Row>
              </ListGroup.Item>

              {productDetail.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col xs="auto" className="my-1 ">
                      <Form.Select
                        as="select"
                        value={qty}
                        onChange={qtyHandler}
                      >
                        {arr.map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </Form.Select>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item className="centre">
                {productDetail.countInStock === 0 ? (
                  <Button className="btn-block" disabled type="button">
                    Add To Cart
                  </Button>
                ) : (
                  <Button
                    onClick={addToCartHandler}
                    className="btn-block"
                    type="button"
                  >
                    Add To Cart
                  </Button>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {!review && (
        <Button
          className="btn btn-block my-3"
          onClick={() => {
            setReview(true);
          }}
        >
          Review The Product
        </Button>
      )}

      {review && (
        <Row>
          <Col md={6}>
            <h4 className="my-2">Reviews</h4>

            {productDetail.reviews.length === 0 && (
              <Error variant="info">No Reviews</Error>
            )}

            <ListGroup className="my-2" variant="flush">
              {productDetail.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating value={review.rating} color="#f8e825" />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}

              <ListGroup.Item className="my-3">
                <h4 className="my-3">Write a review</h4>

                {reviewIsLoading && <LoadingSpinner />}
                {reviewIsError && (
                  <Error variant="danger">
                    Something Went Wrong(Server Error)
                  </Error>
                )}
                {response && userInfo ? (
                  <Error variant="info"> {response}</Error>
                ) : (
                  ""
                )}

                {userInfo ? (
                  <Form className="my-3" onSubmit={submitHandler}>
                    <Form.Group controlId="rating">
                      <Form.Label className="mt-4">Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="comment">
                      <Form.Label className="mt-4">Review</Form.Label>
                      <Form.Control
                        as="textarea"
                        row="5"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Button
                      className="mt-4"
                      disabled={reviewIsLoading}
                      type="submit"
                      variant="primary"
                    >
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <Error variant="info">
                    Please{" "}
                    <Link className="btn-block" to="/login">
                      login
                    </Link>{" "}
                    to write a review
                  </Error>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      )}
    </div>
  );

  if (isLoading) {
    productDetailContent = <LoadingSpinner />;
  }

  if (isError) {
    productDetailContent = (
      <Error variant="danger"> Something Went Wrong(Server Error) </Error>
    );
  }

  return <>{productDetailContent};</>;
};

export default ProductDetail;
