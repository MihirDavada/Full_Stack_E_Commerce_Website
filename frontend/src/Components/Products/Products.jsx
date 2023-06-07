import React, { useCallback, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import ProductItem from "../ProductItem/ProductItem.jsx";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Error from "../errorMessage/Error.jsx";
import { useDispatch, useSelector } from "react-redux";
import { productActions } from "../../Store/productSlice.js";
import { useLocation } from "react-router-dom";
import ProductCarousel from "./ProductCarousel.jsx";

const Products = () => {
  const location = useLocation();

  const latestLoadingState = (state) => {
    return state.products.isLoading;
  };

  const isLoading = useSelector(latestLoadingState);

  const latestErrorState = (state) => {
    return state.products.isError;
  };

  const isError = useSelector(latestErrorState);

  const latestProductState = (state) => {
    return state.products.products;
  };

  const products = useSelector(latestProductState);

  const dispatch = useDispatch();

  const fetchDataHandler = useCallback(
    (keyword = "") => {
      dispatch(productActions.sendingRequest());

      let url = `/firstApp/showProducts${keyword}`;
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
        .then((productsData) => {
          dispatch(productActions.fetchProductSuccessfully(productsData));
        })
        .catch((error) => {
          dispatch(productActions.setTheError());
        });
    },
    [dispatch]
  );

  let keyword = location.search;
  // console.log(keyword)

  useEffect(() => {
    fetchDataHandler(keyword);
  }, [fetchDataHandler, keyword]);

  let productContent = (
    <Row>
      {products.map((product) => {
        return (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <ProductItem product={product} />
          </Col>
        );
      })}
    </Row>
  );

  if (isLoading) {
    productContent = <LoadingSpinner />;
  }

  if (isError) {
    productContent = (
      <Error variant="danger"> Something Went Wrong (Server Error) </Error>
    );
  }

  return (
    <>
      {!keyword && <ProductCarousel />}

      <h1> Latest Products </h1>
      {productContent}
    </>
  );
};

export default Products;
