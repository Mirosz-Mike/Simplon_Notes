import axios from "axios";
export const GET_USER_TOKEN = "GET_USER_TOKEN";
export const REMOVE_USER_TOKEN = "REMOVE_USER_TOKEN";
export const GET_USER_NAME = "GET_USER_NAME";
export const GET_USER_ID = "GET_USER_ID";
export const EDIT_ARTICLE = "EDIT_ARTICLE";
export const GET_ONE_ARTICLE = "GET_ONE_ARTICLE";
export const DELETE_DATA_SUCCESS = "DELETE_DATA_SUCCESS";
export const SHOW_MESSAGE_DELETE = "SHOW_MESSAGE_DELETE";

export function getUserToken(token) {
  return {
    type: GET_USER_TOKEN,
    payload: token
  };
}

export function getUserName(name) {
  return {
    type: GET_USER_NAME,
    payload: name
  };
}

export function getUserId(userId) {
  return {
    type: GET_USER_ID,
    payload: userId
  };
}

export function removeUserToken(removeUserToken) {
  return {
    type: REMOVE_USER_TOKEN,
    payload: removeUserToken
  };
}

export function editArticle(article) {
  return {
    type: EDIT_ARTICLE,
    payload: article
  };
}

export function oneArticle(oneArticle) {
  return {
    type: GET_ONE_ARTICLE,
    payload: oneArticle
  };
}

export function showMessageDelete(bool) {
  return {
    type: SHOW_MESSAGE_DELETE,
    payload: bool
  };
}

export const deleteDataSuccess = response => {
  return {
    type: DELETE_DATA_SUCCESS,
    payload: response.data.message
  };
};

export const deleteImageEditArticle = (id, token) => {
  return dispatch => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/articles/deleteImagesArticle/${id}`, {
        headers: { "x-auth-token": token }
      })
      .then(response => {
        dispatch(deleteDataSuccess(response));
      })
      .catch(error => {
        console.log("erreur redux", error);
      });
  };
};
