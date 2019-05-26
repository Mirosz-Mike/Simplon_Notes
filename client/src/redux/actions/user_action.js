export const GET_USER_TOKEN = "GET_USER_TOKEN";

export function getUserToken(val) {
  return {
    type: GET_USER_TOKEN,
    payload: val
  };
}
