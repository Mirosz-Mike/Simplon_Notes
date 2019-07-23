import {
  GET_USER_TOKEN,
  REMOVE_USER_TOKEN,
  GET_USER_NAME,
  GET_USER_ID,
  EDIT_ARTICLE,
  GET_ONE_ARTICLE,
  REMOVE_IMAGE_RESOURCE
} from "../actions/action";

const DEFAULT = {
  userName: "",
  token: "",
  userId: ""
};

export default function userReducer(state = DEFAULT, action) {
  switch (action.type) {
    case GET_USER_TOKEN:
      return {
        ...state,
        token: action.payload
      };
    case REMOVE_USER_TOKEN: {
      return {};
    }
    case GET_USER_NAME: {
      return {
        ...state,
        userName: action.payload
      };
    }
    case GET_USER_ID: {
      return {
        ...state,
        userId: action.payload
      };
    }
    case EDIT_ARTICLE: {
      return {
        ...state,
        editArticle: action.payload
      };
    }
    case GET_ONE_ARTICLE: {
      return {
        ...state,
        oneArticle: action.payload
      };
    }
    case REMOVE_IMAGE_RESOURCE: {
      return {
        remove: [state.editArticle].filter(data => console.log(data))
      };
    }
    default:
      return state;
  }
}
