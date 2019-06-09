export const GET_USER_TOKEN = "GET_USER_TOKEN";
export const REMOVE_USER_TOKEN = "REMOVE_USER_TOKEN";
export const GET_USER_NAME = "GET_USER_NAME";
export const GET_USER_ID = "GET_USER_ID";
export const EDIT_ARTICLE = "EDIT_ARTICLE";

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
