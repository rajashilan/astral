import {
  GET_AUTHENTICATED_USER,
  SET_LOADING_USER,
  STOP_LOADING_USER,
} from "../type";

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
              console.log(e);
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
