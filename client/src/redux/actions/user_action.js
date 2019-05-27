export const GET_USER_TOKEN = "GET_USER_TOKEN";
export const REMOVE_USER_TOKEN = "REMOVE_USER_TOKEN";
export const GET_USER_NAME = "GET_USER_NAME";

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
