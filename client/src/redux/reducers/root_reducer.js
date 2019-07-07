import { combineReducers } from "redux";
import userReducer from "../reducers/reducer";

const rootReducer = combineReducers({
  user: userReducer
});

export default rootReducer;
