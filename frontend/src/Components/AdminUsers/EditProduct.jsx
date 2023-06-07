import React, { useCallback, useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../Container/FormContainer.jsx";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Error from "../errorMessage/Error.jsx";
import { useNavigate } from "react-router-dom";
import { productDetailsByIdActions } from "../../Store/productDetailByIdSlice.js";
import { adminUpdateProductAction } from "../../Store/adminUpdateProductSlice.js";
import { productActions } from "../../Store/productSlice.js";
import axios from "axios";

const EditProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const param = useParams();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);

  const latestProductDetailsState = (state) => {
    return state.productDetailsById.productDetailsById;
  };

  const product = useSelector(latestProductDetailsState);

  const latestAdminUpdatedProductState = (state) => {
    return state.adminUpdateProduct.adminUpdatedProduct;
  };

  const adminUpdatedProduct = useSelector(latestAdminUpdatedProductState);

  const latestProductIsLoadingState = (state) => {
    return state.productDetailsById.isLoading;
  };

  const isLoading = useSelector(latestProductIsLoadingState);

  const latestAdminUpdatedProductIsLoadingState = (state) => {
    return state.adminUpdateProduct.isLoading;
  };

  const updateIsLoading = useSelector(latestAdminUpdatedProductIsLoadingState);

  const latestProductIsErrorState = (state) => {
    return state.productDetailsById.isError;
  };

  const isError = useSelector(latestProductIsErrorState);

  const latestAdminUpdateProductIsErrorState = (state) => {
    return state.adminUpdateProduct.isError;
  };

  const updateIsError = useSelector(latestAdminUpdateProductIsErrorState);

  const latestAdminUpdateProductSuccessState = (state) => {
    return state.adminUpdateProduct.success;
  };

  const updateSuccess = useSelector(latestAdminUpdateProductSuccessState);

  const fetchProductDataHandler = useCallback(() => {
    dispatch(productDetailsByIdActions.sendingRequest());

    const url = `/firstApp/productDetails/${param.productId}`;

    let params = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${userInfo.token}`,
      },
    };

    fetch(url, params)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Something Went wrong...!!");
        }
        return response.json();
      })
      .then((productDetailsData) => {
        dispatch(
          productDetailsByIdActions.fetchProductDetailSuccessfully(
            productDetailsData
          )
        );
      })
      .catch((error) => {
        dispatch(productDetailsByIdActions.setTheError());
      });
  }, [dispatch, param, userInfo]);

  const fetchUpdatedDataHandler = useCallback(() => {
    dispatch(adminUpdateProductAction.sendingRequest());

    const url = `/firstApp/admin/updateProduct/${param.productId}`;

    let params = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({
        _id: param.productId,
        name: name,
        price: price,
        image: image,
        brand: brand,
        category: category,
        countInStock: countInStock,
        description: description,
        productSlug: productSlug,
      }),
    };

    fetch(url, params)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }
        return response.json();
      })
      .then((updatedProductData) => {
        dispatch(
          adminUpdateProductAction.fetchProductInfoSuccessfully(
            updatedProductData
          )
        );
        dispatch(
          productActions.fetchProductDetailSuccessfully(updatedProductData)
        );
        dispatch(
          productDetailsByIdActions.fetchProductDetailSuccessfully(
            updatedProductData
          )
        );
      })
      .catch((error) => {
        dispatch(adminUpdateProductAction.setTheError());
      });
  }, [
    dispatch,
    userInfo,
    brand,
    category,
    countInStock,
    description,
    image,
    name,
    price,
    param,
    productSlug,
  ]);

  useEffect(() => {
    if (updateSuccess) {
      dispatch(adminUpdateProductAction.resetUser());
      navigate("/admin/productList");
    } else {
      if (!product.name || product._id !== Number(param.productId)) {
        fetchProductDataHandler();
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
        setProductSlug(product.product_slug);
      }
    }
  }, [
    fetchProductDataHandler,
    param,
    dispatch,
    navigate,
    product,
    updateSuccess,
  ]);

  const submitHandler = (event) => {
    event.preventDefault();
    fetchUpdatedDataHandler();
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);
    formData.append("product_id", param.productId);

    setUploading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        "/firstApp/admin/uploadImage/",
        formData,
        config
      );

      setImage(data);
      setUploading(false);
    } catch (error) {
      setUploading(false);
      setError(true);
    }
  };

  return (
    <div>
      <Link to="/admin/productList">
        {" "}
        <Button> Go Back</Button>
      </Link>

      <FormContainer>
        <h1>Edit Product</h1>

        {updateIsLoading && <LoadingSpinner />}
        {updateIsError && (
          <Error variant="danger"> Something Went Wrong( Server Error) </Error>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : isError ? (
          <Error variant="danger"> Something Went Wrong (Server Error) </Error>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="my-2">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price" className="my-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                ></Form.Control>

                <Form.Control
                  type="file"
                  label="Choose File"
                  onChange={uploadFileHandler}
                ></Form.Control>

                {error && <Error variant='danger'> Something Went Wrong (Server Error)</Error>}

                {uploading && <LoadingSpinner />}
              </>
            </Form.Group>

            <Form.Group controlId="brand" className="my-2">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countinstock" className="my-2">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter stock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="category" className="my-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="description" className="my-2">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="productSlug" className="my-2">
              <Form.Label>productSlug</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter ProductSlug"
                value={productSlug}
                onChange={(e) => setProductSlug(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary" className="my-4">
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default EditProduct;
