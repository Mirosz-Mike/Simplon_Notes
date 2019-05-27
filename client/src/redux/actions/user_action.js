export const GET_USER_TOKEN = "GET_USER_TOKEN";

export function getUserToken(token) {
  return {
    type: GET_USER_TOKEN,
    token
  };
}
