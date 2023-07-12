import {
  GET_AUTHENTICATED_USER,
  SET_LOADING_USER,
  STOP_LOADING_USER,
} from "../type";

const initialState = {
  credentials: {},
  authenticated: false,
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_AUTHENTICATED_USER:
      return {
        ...state,
        authenticated: true,
        credentials: { ...action.payload },
      };
    case SET_LOADING_USER:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING_USER:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
