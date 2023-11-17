import { SET_UI_LOADING, STOP_UI_LOADING } from "../type";

const initialState = {
  errors: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_UI_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_UI_LOADING:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
