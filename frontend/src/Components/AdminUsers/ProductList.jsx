import React, { useCallback, useEffect } from "react";
import { Button, Table, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Error from "../errorMessage/Error.jsx";
import { useNavigate } from "react-router-dom";
import { productActions } from "../../Store/productSlice.js";
import { adminDeleteProductAction } from "../../Store/adminDeleteProductSlice.js";
import { adminCreatedProductAction } from "../../Store/adminCreateProductSlice.js";

const ProductList = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const latestLoadingState = (state) => {
    return state.products.isLoading;
  };

  const isLoading = useSelector(latestLoadingState);

  const latestDeleteIsLoadingState = (state) => {
    return state.adminDeleteProduct.isLoading;
  };

  const deleteIsLoading = useSelector(latestDeleteIsLoadingState);

  const latestCreateIsLoadingState = (state) => {
    return state.adminCreatedProduct.isLoading;
  };

  const createIsLoading = useSelector(latestCreateIsLoadingState);

  const latestErrorState = (state) => {
    return state.products.isError;
  };

  const isError = useSelector(latestErrorState);

  const latestDeleteIsErrorState = (state) => {
    return state.adminDeleteProduct.isError;
  };

  const deleteIsError = useSelector(latestDeleteIsErrorState);

  const latestCreateIsErrorState = (state) => {
    return state.adminCreatedProduct.isError;
  };

  const createIsError = useSelector(latestCreateIsErrorState);

  const latestDeleteSuccessState = (state) => {
    return state.adminDeleteProduct.success;
  };

  const deleteSuccess = useSelector(latestDeleteSuccessState);

  const latestProductState = (state) => {
    return state.products.products;
  };

  const products = useSelector(latestProductState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);

  const latestSuccessCreateState = (state) => {
    return state.adminCreatedProduct.success;
  };

  const successCreate = useSelector(latestSuccessCreateState);

  const latestCreatedProductState = (state) => {
    return state.adminCreatedProduct.adminCreatedProduct;
  };

  const adminCreatedProduct = useSelector(latestCreatedProductState);

  const fetchDataHandler = useCallback(() => {
    dispatch(productActions.sendingRequest());

    let url = "/firstApp/showProducts";
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
  }, [dispatch]);

  const deleteDataHandler = useCallback(
    (id) => {
      dispatch(adminDeleteProductAction.sendingRequest());

      const url = `/firstApp/admin/deleteProduct/${id}`;

      let params = {
        method: "DELETE",
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
        .then((deletedProductData) => {
          dispatch(
            adminDeleteProductAction.DeleteProductSuccessfully(
              deletedProductData
            )
          );
        })
        .catch((error) => {
          dispatch(adminDeleteProductAction.setTheError());
        });
    },
    [dispatch, userInfo]
  );

  const deleteHandler = (id) => {
    if (window.confirm("Are You Sure You Want To Delete This Product??")) {
      deleteDataHandler(id);
    }
  };

  const fetchCreatedProductHandler = useCallback(() => {
    dispatch(adminCreatedProductAction.sendingRequest());

    const url = "/firstApp/admin/createProduct/";

    let params = {
      method: "POST",
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
      .then((createdProductData) => {
        dispatch(
          adminCreatedProductAction.fetchCreatedProductSuccessfully(
            createdProductData
          )
        );
      })
      .catch((error) => {
        dispatch(adminCreatedProductAction.setTheError());
      });
  }, [dispatch, userInfo]);

  const createProductHandler = () => {
    fetchCreatedProductHandler();
  };

  useEffect(() => {
    dispatch(adminCreatedProductAction.resetUser());
    if (!userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/${adminCreatedProduct._id}/edit`);
    } else {
      fetchDataHandler();
    }
  }, [
    fetchDataHandler,
    userInfo,
    navigate,
    deleteSuccess,
    dispatch,
    successCreate,
    adminCreatedProduct,
  ]);

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>

        <Col style={{ textAlign: "right" }}>
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>

      {deleteIsLoading && <LoadingSpinner />}
      {deleteIsError && <Error variant="danger">Something Went Wrong( Server Error )</Error>}

      {createIsLoading && <LoadingSpinner/>}
      {createIsError && <Error variant="danger">Something Went Wrong( Server Error)</Error>}

      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Error variant="danger"> Something Went Wrong </Error>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>

                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                </td>

                <td>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteHandler(product._id)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductList;
