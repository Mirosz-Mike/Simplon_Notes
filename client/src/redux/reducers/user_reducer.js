import {
  GET_USER_TOKEN,
  REMOVE_USER_TOKEN,
  GET_USER_NAME
} from "../actions/user_action";

const DEFAULT = {
  userName: "",
  token: ""
};

export default function userReducer(state = DEFAULT, action) {
  switch (action.type) {
    case GET_USER_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case REMOVE_USER_TOKEN: {
      return {
        ...state,
        userName: "",
        token: ""
      };
    }
    case GET_USER_NAME: {
      return {
        ...state,
        userName: action.payload
      };
    }
    default:
      return state;
  }
}
