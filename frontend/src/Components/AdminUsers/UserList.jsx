import React, { useCallback, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner.jsx";
import Error from "../errorMessage/Error.jsx";
import { userListAction } from "../../Store/userListSlice.js";
import { useNavigate } from "react-router-dom";
import { userDeleteAction } from "../../Store/userDeleteSlice.js";

const UserList = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const latestUsersIsLoadingState = (state) => {
    return state.users.isLoading;
  };
  const isLoading = useSelector(latestUsersIsLoadingState);

  const latestDeleteUsersIsLoadingState = (state) => {
    return state.deleteUser.isLoading;
  };
  const deleteIsLoading = useSelector(latestDeleteUsersIsLoadingState);

  const latestUsersIsErrorState = (state) => {
    return state.users.isError;
  };
  const isError = useSelector(latestUsersIsErrorState);

  const latestDeleteUsersIsErrorState = (state) => {
    return state.deleteUser.isError;
  };
  const deleteIsError = useSelector(latestDeleteUsersIsErrorState);

  const latestDeleteUsersSuccessState = (state) => {
    return state.deleteUser.success;
  };
  const successDelete = useSelector(latestDeleteUsersSuccessState);

  const latestUsersState = (state) => {
    return state.users.users;
  };

  const users = useSelector(latestUsersState);

  const latestUserInfoState = (state) => {
    return state.auth.userInfo;
  };

  const userInfo = useSelector(latestUserInfoState);

  const fetchDataHandler = useCallback(() => {
    dispatch(userListAction.sendingRequest());

    const url = "/firstApp/admin/users/";

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
          throw new Error();
        }
        return response.json();
      })
      .then((usersData) => {
        // console.log(usersData);
        dispatch(userListAction.fetchUsersSuccessfully(usersData));
      })
      .catch((error) => {
        dispatch(
          userListAction.setTheError(
            "No active Account found with this given credentials"
          )
        );
      });
  }, [dispatch, userInfo]);

  const deleteDataHandler = useCallback(
    (id) => {
      dispatch(userDeleteAction.sendingRequest());

      const url = `/firstApp/admin/deleteUser/${id}`;

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
        .then((deletedUserData) => {
          dispatch(userDeleteAction.DeleteUsersSuccessfully(deletedUserData));
        })
        .catch((error) => {
          dispatch(userDeleteAction.setTheError());
        });
    },
    [dispatch, userInfo]
  );

  const deleteHandler = (id) => {
    if(window.confirm("Are You Sure You Want To Delete This User??")){
      deleteDataHandler(id);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchDataHandler();
    } else {
      navigate("/login");
    }
  }, [fetchDataHandler, userInfo, navigate, successDelete]);

  return (
    <>
      <h1> Users </h1>
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
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isAdmin ? (
                    <i className="fas fa-check" style={{ color: "green" }}></i>
                  ) : (
                    <i className="fas fa-check" style={{ color: "red" }}></i>
                  )}
                </td>

                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant="light" className="btn-sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </LinkContainer>
                </td>

                <td>
                  {deleteIsLoading ? (
                    <LoadingSpinner />
                  ) : deleteIsError ? (
                    <Error variant="danger">
                      Something Went Wrong(Server Error)
                    </Error>
                  ) : (
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserList;
