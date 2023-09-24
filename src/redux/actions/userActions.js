import {
  GET_AUTHENTICATED_USER,
  SET_LOADING_USER,
  STOP_LOADING_USER,
  UPDATE_USER_BIO,
  UPDATE_USER_PHOTO,
} from "../type";

import Toast from "react-native-toast-message";

import { firebase } from "../../firebase/config";
import { getUserCampus, getUserCollege } from "./dataActions";
const db = firebase.firestore();

export const getAuthenticatedUser = (email) => (dispatch) => {
  dispatch({ type: SET_LOADING_USER });
  if (email) {
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((data) => {
        if (data.length === 0) {
          signOutUser = async () => {
            try {
              await firebase.auth().signOut();
            } catch (e) {
              console.error(e);
            }
          };
        } else {
          data.forEach((doc) => {
            let data = { ...doc.data() };
            dispatch({
              type: GET_AUTHENTICATED_USER,
              payload: data,
            });
            //get college details
            //get campus details
            dispatch(getUserCollege(doc.data().college));
            dispatch(getUserCampus(doc.data().campus));
          });
        }
        dispatch({ type: STOP_LOADING_USER });
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: STOP_LOADING_USER });
      });
  }
};

export const updateUserPhoto = (userID, photoUrl) => (dispatch) => {
  dispatch({ type: SET_LOADING_USER });

  db.doc(`/users/${userID}`)
    .update({ profileImage: photoUrl })
    .then(() => {
      dispatch({ type: STOP_LOADING_USER });
      dispatch({ type: UPDATE_USER_PHOTO, payload: photoUrl });
      Toast.show({
        type: "success",
        text1: "profile photo updated successfully.",
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_LOADING_USER });
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    });
};

export const updateUserBio = (userID, bio) => (dispatch) => {
  dispatch({ type: SET_LOADING_USER });

  db.doc(`/users/${userID}`)
    .update({ bio })
    .then(() => {
      dispatch({ type: STOP_LOADING_USER });
      dispatch({ type: UPDATE_USER_BIO, payload: bio });
      Toast.show({
        type: "success",
        text1: "bio updated successfully.",
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_LOADING_USER });
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    });
};
