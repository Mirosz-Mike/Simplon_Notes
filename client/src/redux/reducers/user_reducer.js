import { GET_USER_TOKEN } from "../actions/user_action";

const DEFAULT = {
  token: ""
};

export default function userReducer(state = DEFAULT, action) {
  switch (action.type) {
    case GET_USER_TOKEN:
      return {
        ...state,
        token: action.token
      };
    default:
      return state;
  }
}
