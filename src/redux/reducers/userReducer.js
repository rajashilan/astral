import {
  ADD_USER_CLUB,
  GET_AUTHENTICATED_USER,
  LOGOUT,
  SET_LOADING_USER,
  STOP_LOADING_USER,
  UPDATE_USER_BIO,
  UPDATE_USER_PHOTO,
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
    case ADD_USER_CLUB:
      state.credentials.clubs.push({ ...action.payload });
      console.log(state.credentials.clubs);
      return {
        ...state,
      };
    case UPDATE_USER_PHOTO:
      let userPhoto = { ...state.credentials };
      userPhoto.profileImage = action.payload;

      return {
        ...state,
        credentials: { ...userPhoto },
      };
    case UPDATE_USER_BIO:
      let userBio = { ...state.credentials };
      userBio.bio = action.payload;

      return {
        ...state,
        credentials: { ...userBio },
      };
    case LOGOUT:
      return initialState;
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
