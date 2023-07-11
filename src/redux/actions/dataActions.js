import {
  GET_ORIENTATION_OVERVIEW,
  GET_ORIENTATION_PAGE,
  GET_ORIENTATION_PAGES,
  GET_USER_CAMPUS,
  GET_USER_COLLEGE,
  SET_LOADING_DATA,
  STOP_LOADING_DATA,
} from "../type";

import { firebase } from "../../firebase/config";
const db = firebase.firestore();

//get college details
export const getUserCollege = (college) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.collection("colleges")
    .where("name", "==", college)
    .get()
    .then((data) => {
      dispatch({ type: STOP_LOADING_DATA });
      data.forEach((doc) => {
        let payload = { ...doc.data(), collegeID: doc.id };
        dispatch({ type: GET_USER_COLLEGE, payload: { ...payload } });
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_LOADING_DATA });
    });
};

//get campus details
export const getUserCampus = (campus) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.collection("campuses")
    .where("name", "==", campus)
    .get()
    .then((data) => {
      dispatch({ type: STOP_LOADING_DATA });
      data.forEach((doc) => {
        let payload = { ...doc.data(), campusID: doc.id };
        dispatch({ type: GET_USER_CAMPUS, payload: { ...payload } });
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_LOADING_DATA });
    });
};

export const getOrientation = (campusID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  console.log(campusID);
  console.log("sdhjsdhsdshjdhfkjdhfkhfkhskfkshfk");
  db.collection("orientations")
    .where("campusID", "==", campusID)
    .get()
    .then((data) => {
      dispatch({ type: STOP_LOADING_DATA });
      data.forEach((doc) => {
        let payload = { ...doc.data(), orientationID: doc.id };
        dispatch({
          type: GET_ORIENTATION_OVERVIEW,
          payload: { ...payload },
        });
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_LOADING_DATA });
    });
};

export const getAllOrientationPages = (orientationID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.collection("orientationPages")
    .where("orientationID", "==", orientationID)
    .get()
    .then((data) => {
      dispatch({ type: STOP_LOADING_DATA });
      let pages = [];
      data.forEach((doc) => {
        pages.push({ ...doc.data(), orientationPageID: doc.id });
      });
      dispatch({ type: GET_ORIENTATION_PAGES, payload: [...pages] });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_LOADING_DATA });
    });
};

export const getOrientationPage = (orientationPageID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.doc(`/orientationPages/${orientationPageID}`)
    .get()
    .then((doc) => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: GET_ORIENTATION_PAGE, payload: { ...doc.data() } });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_LOADING_DATA });
    });
};
