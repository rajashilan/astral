import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";

import { getUserCampus, getUserCollege } from "./dataActions";
import {
  GET_AUTHENTICATED_USER,
  SET_LOADING_DATA,
  SET_LOADING_USER,
  SET_NOTIFICATION_AVAILABLE,
  STOP_LOADING_DATA,
  STOP_LOADING_USER,
  UPDATE_USER_BIO,
  UPDATE_USER_PHOTO,
} from "../type";
const db = firestore();

export const getAuthenticatedUser = (email) => (dispatch) => {
  dispatch({ type: SET_LOADING_USER });
  if (email) {
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((data) => {
        if (data.length === 0) {
          const signOutUser = async () => {
            try {
              auth().signOut();
            } catch (e) {
              console.error(e);
            }
          };
          signOutUser();
        } else {
          data.forEach((doc) => {
            const data = { ...doc.data() };
            dispatch({
              type: GET_AUTHENTICATED_USER,
              payload: data,
            });
            //get college details
            //get campus details
            dispatch(getUserCollege(doc.data().college));
            dispatch(getUserCampus(doc.data().campus));

            //also get the latest notification, and check if it is read
            dispatch(getFirstNotification(doc.data().userId));
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

export const getFirstNotification = (userID) => (dispatch) => {
  let query = db
    .collection("notifications")
    .where("userID", "==", userID)
    .orderBy("createdAt", "desc")
    .limit(1);

  query.get().then((data) => {
    data.forEach((doc) => {
      if (doc.data().read === false)
        dispatch({ type: SET_NOTIFICATION_AVAILABLE, payload: true });
    });
  });
};

export const updateUserPhoto = (userID, photoUrl) => (dispatch) => {
  db.collection("users")
    .doc(userID)
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
  dispatch({ type: SET_LOADING_DATA });

  db.collection("users")
    .doc(userID)
    .update({ bio })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: UPDATE_USER_BIO, payload: bio });
      Toast.show({
        type: "success",
        text1: "bio updated successfully.",
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_LOADING_DATA });
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    });
};

export const updateUserPushNotificationToken = (userID, token) => {
  db.collection("users")
    .doc(userID)
    .update({ pushNotificationToken: token })
    .then(() => {
      console.log("successfully updated user's push notification token");
    })
    .catch((error) => {
      console.error("failed to update user's push notification token: ", error);
    });
};

export const deleteAccount = (userID, username) => {
  db.collection("users")
    .doc(userID)
    .delete()
    .then(() => {
      return db.collection("usernames").where("username", "==", username).get();
    })
    .then((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return db.collection("usernames").doc(doc.id).delete();
      } else {
        throw new Error("No document found for the username");
      }
    })
    .then(() => {
      console.log("successfully deleted user");
      Toast.show({
        type: "success",
        text1: "account deleted successfully",
      });
    })
    .catch((error) => {
      console.log("failed to delete user: ", error);
    });
};
