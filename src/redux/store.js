import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import dataReducer from "./reducers/dataReducer";
import uiReducer from "./reducers/uiReducer";
import userReducer from "./reducers/userReducer";

const reducers = combineReducers({
  user: userReducer,
  data: dataReducer,
  UI: uiReducer,
});

export const store = createStore(reducers, applyMiddleware(thunk));
