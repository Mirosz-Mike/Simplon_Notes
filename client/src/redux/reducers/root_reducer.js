import { combineReducers } from "redux";
import userReducer from "../reducers/user_reducer";

const rootReducer = combineReducers({
  user: userReducer
});

export default rootReducer;
