import {
  ADD_CLUB_GALLERY,
  DELETE_GALLERY,
  GET_A_CLUB_DATA,
  GET_ORIENTATION_OVERVIEW,
  GET_ORIENTATION_PAGE,
  GET_ORIENTATION_PAGES,
  GET_USER_CAMPUS,
  GET_USER_COLLEGE,
  SET_CLUB_GALLERY,
  SET_CLUB_GALLERY_TO_FALSE,
  SET_CLUB_GALLERY_TO_TRUE,
  SET_CLUB_MEMBERS_DATA,
  SET_LOADING_DATA,
  STOP_LOADING_DATA,
  UPDATE_CLUB_MEMBER_BIO,
  UPDATE_CLUB_MEMBER_PHOTO,
} from "../type";

const initialState = {
  orientation: {
    overview: {},
    pages: [],
    currentPage: {},
  },
  college: {},
  campus: {},
  loading: false,
  clubData: {
    club: {},
    members: [],
    gallery: [],
    currentMember: {},
  },
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_COLLEGE:
      return {
        ...state,
        college: { ...action.payload },
      };
    case GET_USER_CAMPUS:
      return {
        ...state,
        campus: { ...action.payload },
      };
    case GET_ORIENTATION_OVERVIEW:
      return {
        ...state,
        orientation: {
          pages: [...state.orientation.pages],
          currentPage: { ...state.orientation.currentPage },
          overview: { ...action.payload },
        },
      };
    case GET_ORIENTATION_PAGES:
      return {
        ...state,
        orientation: {
          overview: { ...state.orientation.overview },
          currentPage: { ...state.orientation.currentPage },
          pages: [...action.payload],
        },
      };
    case GET_ORIENTATION_PAGE:
      return {
        ...state,
        orientation: {
          overview: { ...state.orientation.overview },
          pages: [...state.orientation.pages],
          currentPage: { ...action.payload },
        },
      };
    case GET_A_CLUB_DATA:
      return {
        ...state,
        clubData: {
          members: [...state.clubData.members],
          currentMember: { ...state.clubData.currentMember },
          club: { ...action.payload },
          gallery: [...state.clubData.gallery],
        },
      };
    case SET_CLUB_MEMBERS_DATA:
      let currentMember = action.payload.members.findIndex(
        (member) => member.userID === action.payload.userID
      );
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...action.payload.members[currentMember] },
          members: [...action.payload.members],
          gallery: [...state.clubData.gallery],
        },
      };
    case UPDATE_CLUB_MEMBER_BIO:
      let currentMemberBioUpdateIndex = state.clubData.members.findIndex(
        (member) => member.userID === action.payload.userID
      );
      state.clubData.members[currentMemberBioUpdateIndex].bio =
        action.payload.bio;
      state.clubData.currentMember.bio = action.payload.bio;
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
        },
      };
    case UPDATE_CLUB_MEMBER_PHOTO:
      let currentMemberPhotoUpdateIndex = state.clubData.members.findIndex(
        (member) => member.userID === action.payload.userID
      );
      state.clubData.members[currentMemberPhotoUpdateIndex].profileImage =
        action.payload.photoUrl;
      state.clubData.currentMember.profileImage = action.payload.photoUrl;
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
        },
      };
    case SET_CLUB_GALLERY_TO_TRUE:
      let clubGalleryTrue = { ...state.clubData.club };
      clubGalleryTrue.gallery = true;
      return {
        ...state,
        clubData: {
          club: { ...clubGalleryTrue },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
        },
      };
    case SET_CLUB_GALLERY_TO_FALSE:
      let clubGalleryFalse = { ...state.clubData.club };
      clubGalleryFalse.gallery = false;
      return {
        ...state,
        clubData: {
          club: { ...clubGalleryFalse },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
        },
      };
    case SET_CLUB_GALLERY:
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...action.payload.gallery],
        },
      };
    case ADD_CLUB_GALLERY:
      let addClubGalleryTemp = [...state.clubData.gallery];
      addClubGalleryTemp.unshift(action.payload.gallery);
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...addClubGalleryTemp],
        },
      };
    case DELETE_GALLERY:
      let deleteGalleryTemp = [...state.clubData.gallery];
      let findDeleteGalleryIndex = deleteGalleryTemp.findIndex(
        (gallery) => gallery.image === action.payload
      );
      deleteGalleryTemp.splice(findDeleteGalleryIndex, 1);
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...deleteGalleryTemp],
        },
      };
    case SET_LOADING_DATA:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING_DATA:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
