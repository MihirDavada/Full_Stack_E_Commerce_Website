import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Error from "../errorMessage/Error.jsx";
import { topProductActions } from "../../Store/topProductSlice.js";

const ProductCarousel = () => {

    const dispatch = useDispatch()
  const latestStateIsLoadingState = (state) => {
    return state.topProducts.isLoading;
  };

  const isLoading = useSelector(latestStateIsLoadingState);

  const latestStateIsErrorState = (state) => {
    return state.topProducts.isError;
  };

  const isError = useSelector(latestStateIsErrorState);

  const latestStateTopProductState = (state) => {
    return state.topProducts.topProducts;
  };

  const topProducts = useSelector(latestStateTopProductState);

  const fetchTopProductHandler = useCallback(() => {
    dispatch(topProductActions.sendingRequest());

    const url = `/firstApp/showProducts/getTopProducts`;

    let params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, params)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((topProductData) => {
        dispatch(topProductActions.fetchTopProductSuccessfully(topProductData));
      })
      .catch((error) => {
        dispatch(topProductActions.setTheError());
      });
  }, [dispatch]);

  useEffect(() => {
    fetchTopProductHandler();
  }, [fetchTopProductHandler]);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Error variant="danger"> Something Went Wrong</Error>
      ) : (
        <Carousel pause="hover" className="bg-dark">
          {topProducts.map((product) => (
            <Carousel.Item key={product._id}>
              <Link to={`/productDetail/${product.product_slug}`}>
                <Image src={product.image} alt={product.name} fluid />
                <Carousel.Caption className="carousel.caption">
                  <h4>
                    {product.name} (${product.price})
                  </h4>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  );
};

export default ProductCarousel;
