export const GET_USER_TOKEN = "GET_USER_TOKEN";
export const REMOVE_USER_TOKEN = "REMOVE_USER_TOKEN";
export const GET_USER_NAME = "GET_USER_NAME";
export const GET_USER_ID = "GET_USER_ID";
export const EDIT_ARTICLE = "EDIT_ARTICLE";
export const GET_ONE_ARTICLE = "GET_ONE_ARTICLE";
export const REMOVE_IMAGE_RESOURCE = "REMOVE_IMAGE_RESOURCE";

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

export const deleteImgResource = name => {
  return {
    type: REMOVE_IMAGE_RESOURCE,
    payload: name
  };
};
