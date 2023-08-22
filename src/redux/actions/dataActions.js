import {
  ADD_CLUB_EVENT,
  ADD_CLUB_GALLERY,
  DELETE_EVENT,
  DELETE_GALLERY,
  GET_A_CLUB_DATA,
  GET_ORIENTATION_OVERVIEW,
  GET_ORIENTATION_PAGE,
  GET_ORIENTATION_PAGES,
  GET_USER_CAMPUS,
  GET_USER_COLLEGE,
  SET_CLUB_EVENT,
  SET_CLUB_EVENT_TO_FALSE,
  SET_CLUB_EVENT_TO_TRUE,
  SET_CLUB_GALLERY,
  SET_CLUB_GALLERY_TO_FALSE,
  SET_CLUB_GALLERY_TO_TRUE,
  SET_CLUB_MEMBERS_DATA,
  SET_LOADING_DATA,
  STOP_LOADING_DATA,
  UPDATE_CLUB_MEMBER_BIO,
  UPDATE_CLUB_MEMBER_PHOTO,
} from "../type";

import Toast from "react-native-toast-message";

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

export const getAClub = (clubID, userID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.doc(`/clubs/${clubID}`)
    .get()
    .then((doc) => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: GET_A_CLUB_DATA, payload: { ...doc.data() } });
      dispatch(getClubMembers(clubID, userID));
    })
    .catch((error) => {
      dispatch({ type: STOP_LOADING_DATA });
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    });
};

export const getClubMembers = (clubID, userID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.doc(`/clubMembers/${clubID}`)
    .get()
    .then((doc) => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({
        type: SET_CLUB_MEMBERS_DATA,
        payload: { members: [...doc.data().members], userID },
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

export const updateClubMemberBio =
  (clubName, clubID, userID, bio) => (dispatch) => {
    dispatch({ type: SET_LOADING_DATA });

    db.doc(`/clubMembers/${clubID}`)
      .get()
      .then((doc) => {
        let temp = [...doc.data().members];
        let index = temp.findIndex((member) => member.userID === userID);
        temp[index].bio = bio;

        return db.doc(`/clubMembers/${clubID}`).update({ members: [...temp] });
      })
      .then(() => {
        dispatch({ type: STOP_LOADING_DATA });
        dispatch({
          type: UPDATE_CLUB_MEMBER_BIO,
          payload: { userID, bio },
        });
        Toast.show({
          type: "success",
          text1: `Updated your bio for ${clubName} successfully.`,
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

export const updateClubMemberPhoto =
  (clubName, clubID, userID, photoUrl) => (dispatch) => {
    dispatch({ type: SET_LOADING_DATA });

    db.doc(`/clubMembers/${clubID}`)
      .get()
      .then((doc) => {
        let temp = [...doc.data().members];
        let index = temp.findIndex((member) => member.userID === userID);
        temp[index].profileImage = photoUrl;

        return db.doc(`/clubMembers/${clubID}`).update({ members: [...temp] });
      })
      .then(() => {
        dispatch({ type: STOP_LOADING_DATA });
        dispatch({
          type: UPDATE_CLUB_MEMBER_PHOTO,
          payload: { userID, photoUrl },
        });
        Toast.show({
          type: "success",
          text1: `Updated your profile photo for ${clubName} successfully.`,
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

//club gallery

export const getClubGallery = (clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.doc(`/gallery/${clubID}`)
    .get()
    .then((doc) => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({
        type: SET_CLUB_GALLERY,
        payload: { gallery: [...doc.data().gallery] },
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

export const addClubsGallery =
  (clubName, clubID, userID, image, title, content) => (dispatch) => {
    dispatch({ type: SET_LOADING_DATA });

    let data = {
      image,
      title,
      content,
    };

    db.doc(`/gallery/${clubID}`)
      .get()
      .then((doc) => {
        let temp = [...doc.data().gallery];
        temp.unshift(data);

        return db.doc(`/gallery/${clubID}`).update({ gallery: [...temp] });
      })
      .then(() => {
        dispatch({ type: STOP_LOADING_DATA });
        dispatch({ type: ADD_CLUB_GALLERY, payload: { gallery: { ...data } } });
        Toast.show({
          type: "success",
          text1: `Added to gallery successfully`,
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

export const setClubGalleryToTrue = (clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.doc(`/clubs/${clubID}`)
    .update({ gallery: true })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: SET_CLUB_GALLERY_TO_TRUE, payload: clubID });
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

export const setClubGalleryToFalse = (clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.doc(`/clubs/${clubID}`)
    .update({ gallery: false })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: SET_CLUB_GALLERY_TO_FALSE, payload: clubID });
      Toast.show({
        type: "success",
        text1: `Photo deleted successfully`,
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

export const handleDeleteClubGallery = (image, clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.doc(`/gallery/${clubID}`)
    .get()
    .then((doc) => {
      let temp = [...doc.data().gallery];
      let index = temp.findIndex((gallery) => gallery.image === image);
      temp.splice(index, 1);

      return db.doc(`/gallery/${clubID}`).update({ gallery: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: DELETE_GALLERY, payload: image });
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

//club event

export const getClubEvent = (clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.doc(`/events/${clubID}`)
    .get()
    .then((doc) => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({
        type: SET_CLUB_EVENT,
        payload: { event: [...doc.data().events] },
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

//date, image, title, content, eventID
export const addClubEvent =
  (clubName, clubID, userID, image, title, content, date, eventID) =>
  (dispatch) => {
    dispatch({ type: SET_LOADING_DATA });

    let data = {
      image,
      title,
      content,
      date,
      eventID,
    };

    db.doc(`/events/${clubID}`)
      .get()
      .then((doc) => {
        let temp = [...doc.data().events];
        temp.unshift(data);

        return db.doc(`/events/${clubID}`).update({ events: [...temp] });
      })
      .then(() => {
        dispatch({ type: STOP_LOADING_DATA });
        dispatch({ type: ADD_CLUB_EVENT, payload: { event: { ...data } } });
        Toast.show({
          type: "success",
          text1: `Added to events successfully`,
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

export const setClubEventToTrue = (clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.doc(`/clubs/${clubID}`)
    .update({ events: true })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: SET_CLUB_EVENT_TO_TRUE, payload: clubID });
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

export const setClubEventToFalse = (clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.doc(`/clubs/${clubID}`)
    .update({ events: false })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: SET_CLUB_EVENT_TO_FALSE, payload: clubID });
      Toast.show({
        type: "success",
        text1: `Event deleted successfully`,
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

export const handleDeleteClubEvent = (eventID, clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.doc(`/events/${clubID}`)
    .get()
    .then((doc) => {
      let temp = [...doc.data().events];
      let index = temp.findIndex((events) => events.eventID === eventID);
      temp.splice(index, 1);

      return db.doc(`/events/${clubID}`).update({ events: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: DELETE_EVENT, payload: eventID });
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
