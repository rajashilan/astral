import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import axios from "axios";
import Toast from "react-native-toast-message";

import {
  ACCEPT_NEW_CLUB_MEMBER,
  ACTIVATE_CLUB,
  ADD_CLUB_EVENT,
  ADD_CLUB_GALLERY,
  ADD_NEW_CLUB_ROLE,
  ADD_NEW_POST,
  ASSIGN_NEW_CLUB_ROLE,
  DEACTIVATE_CLUB,
  DEACTIVATE_CLUB_MEMBER,
  DELETE_CLUB_ROLE,
  DELETE_EVENT,
  DELETE_GALLERY,
  GET_A_CLUB_DATA,
  GET_ORIENTATION_OVERVIEW,
  GET_ORIENTATION_PAGE,
  GET_ORIENTATION_PAGES,
  GET_USER_CAMPUS,
  GET_USER_COLLEGE,
  JOIN_CLUB,
  REJECT_NEW_CLUB_MEMBER,
  SET_CLUB_EVENT,
  SET_CLUB_EVENT_TO_FALSE,
  SET_CLUB_EVENT_TO_TRUE,
  SET_CLUB_GALLERY,
  SET_CLUB_GALLERY_TO_FALSE,
  SET_CLUB_GALLERY_TO_TRUE,
  SET_CLUB_MEMBERS_DATA,
  SET_LOADING_DATA,
  SET_NOTIFICATION_AVAILABLE,
  SET_POSTS,
  SET_UI_LOADING,
  STOP_LOADING_DATA,
  STOP_LOADING_USER,
  STOP_UI_LOADING,
  UPDATE_CLUB_DETAILS,
  UPDATE_CLUB_IMAGE,
  UPDATE_CLUB_MEMBER_BIO,
  UPDATE_CLUB_MEMBER_PHOTO,
} from "../type";
const db = firestore();

//get college details
export const getUserCollege = (college) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.collection("colleges")
    .where("name", "==", college)
    .get()
    .then((data) => {
      dispatch({ type: STOP_LOADING_DATA });
      data.forEach((doc) => {
        const payload = { ...doc.data(), collegeID: doc.id };
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
        const payload = { ...doc.data(), campusID: doc.id };
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
        const payload = { ...doc.data(), orientationID: doc.id };
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
      const pages = [];
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

  db.collection("orientationPages")
    .doc(orientationPageID)
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
  dispatch({ type: SET_UI_LOADING });

  db.collection("clubs")
    .doc(clubID)
    .get()
    .then((doc) => {
      dispatch({ type: GET_A_CLUB_DATA, payload: { ...doc.data() } });

      return db.collection("clubMembers").doc(clubID).get();
    })
    .then((doc) => {
      dispatch({
        type: SET_CLUB_MEMBERS_DATA,
        payload: { members: [...doc.data().members], userID },
      });

      return db
        .collection("posts")
        .where("clubID", "==", clubID)
        .orderBy("createdAt", "desc")
        .get();
    })
    .then((data) => {
      let temp = [];
      data.forEach((doc) => {
        temp.push({ ...doc.data() });
      });
      dispatch({ type: STOP_UI_LOADING });
      dispatch({ type: SET_POSTS, payload: temp });
    })
    .catch((error) => {
      dispatch({ type: STOP_UI_LOADING });
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
      console.error(error);
    });
};

export const getClubMembers = (clubID, userID) => (dispatch) => {
  dispatch({ type: SET_UI_LOADING });

  db.collection("clubMembers")
    .doc(clubID)
    .get()
    .then((doc) => {
      dispatch({ type: STOP_UI_LOADING });
      dispatch({
        type: SET_CLUB_MEMBERS_DATA,
        payload: { members: [...doc.data().members], userID },
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_UI_LOADING });
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    });
};

export const updateClubMemberBio =
  (clubName, clubID, userID, bio) => (dispatch) => {
    dispatch({ type: SET_LOADING_DATA });

    db.collection("clubMembers")
      .doc(clubID)
      .get()
      .then((doc) => {
        const temp = [...doc.data().members];
        const index = temp.findIndex((member) => member.userID === userID);
        temp[index].bio = bio;

        return db
          .collection("clubMembers")
          .doc(clubID)
          .update({ members: [...temp] });
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
    db.collection("clubMembers")
      .doc(clubID)
      .get()
      .then((doc) => {
        const temp = [...doc.data().members];
        const index = temp.findIndex((member) => member.userID === userID);
        temp[index].profileImage = photoUrl;

        return db
          .collection("clubMembers")
          .doc(clubID)
          .update({ members: [...temp] });
      })
      .then(() => {
        dispatch({ type: STOP_LOADING_USER });
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
        dispatch({ type: STOP_LOADING_USER });
        Toast.show({
          type: "error",
          text1: "Something went wrong",
        });
      });
  };

//club gallery

export const getClubGallery = (clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.collection("gallery")
    .doc(clubID)
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
  (
    clubName,
    clubID,
    userID,
    image,
    title,
    content,
    campusID,
    galleryID,
    hasGallery,
    toDeleteGalleryID
  ) =>
  (dispatch) => {
    dispatch({ type: SET_LOADING_DATA });

    const data = {
      image,
      title,
      content,
      approval: "pending",
      galleryID,
      rejectionReason: "",
      createdAt: new Date().toISOString(),
    };

    const pendingGalleryData = {
      clubName,
      clubID,
      image,
      title,
      content,
      activity: "Gallery",
      campusID,
      activityID: "",
      galleryID,
      hasGallery,
      createdAt: new Date().toISOString(),
    };

    db.collection("gallery")
      .doc(clubID)
      .get()
      .then((doc) => {
        const temp = [...doc.data().gallery];
        temp.unshift(data);

        return db
          .collection("gallery")
          .doc(clubID)
          .update({ gallery: [...temp] });
      })
      .then(() => {
        return db.collection("pendingGallery").add(pendingGalleryData);
      })
      .then((data) => {
        return db
          .collection("pendingGallery")
          .doc(data.id)
          .update({ activityID: data.id });
      })
      .then(() => {
        if (toDeleteGalleryID)
          dispatch(handleDeleteClubGallery(toDeleteGalleryID, clubID, false));
        dispatch({ type: STOP_LOADING_DATA });
        dispatch({
          type: ADD_CLUB_GALLERY,
          payload: { gallery: { ...data } },
        });
        Toast.show({
          type: "success",
          text1: `Submitted gallery request successfully`,
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
  db.collection("clubs")
    .doc(clubID)
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

export const setClubGalleryToFalse = (clubID, campusID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.collection("clubs")
    .doc(clubID)
    .update({ gallery: false, status: "inactive" })
    .then(() => {
      return db.collection("clubsOverview").doc(campusID).get();
    })
    .then((doc) => {
      const temp = [...doc.data().clubs];
      const index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].status = "inactive";

      return db
        .collection("clubsOverview")
        .doc(campusID)
        .update({ clubs: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: SET_CLUB_GALLERY_TO_FALSE, payload: clubID });
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

export const handleDeleteClubGallery =
  (galleryID, clubID, showToastMessage) => (dispatch) => {
    dispatch({ type: SET_LOADING_DATA });
    db.collection("gallery")
      .doc(clubID)
      .get()
      .then((doc) => {
        const temp = [...doc.data().gallery];
        const index = temp.findIndex(
          (gallery) => gallery.galleryID === galleryID
        );
        temp.splice(index, 1);
        return db
          .collection("gallery")
          .doc(clubID)
          .update({ gallery: [...temp] });
      })
      .then(() => {
        dispatch({ type: STOP_LOADING_DATA });
        dispatch({ type: DELETE_GALLERY, payload: galleryID });
        if (showToastMessage)
          Toast.show({
            type: "success",
            text1: `Photo deleted successfully`,
          });
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: STOP_LOADING_DATA });
        if (showToastMessage)
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
      });
  };

//club event

export const getClubEvent = (clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.collection("events")
    .doc(clubID)
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
  (
    clubName,
    clubID,
    userID,
    image,
    title,
    content,
    date,
    eventID,
    campusID,
    hasEvents,
    toDeleteEventID
  ) =>
  (dispatch) => {
    dispatch({ type: SET_LOADING_DATA });

    const data = {
      image,
      title,
      content,
      date,
      eventID,
      approval: "pending",
      rejectionReason: "",
      createdAt: new Date().toISOString(),
    };

    const pendingEventData = {
      clubName,
      clubID,
      image,
      title,
      content,
      date,
      eventID,
      activity: "Event",
      campusID,
      activityID: "",
      hasEvents,
      createdAt: new Date().toISOString(),
    };

    db.collection("events")
      .doc(clubID)
      .get()
      .then((doc) => {
        const temp = [...doc.data().events];
        temp.unshift(data);

        return db
          .collection("events")
          .doc(clubID)
          .update({ events: [...temp] });
      })
      .then(() => {
        return db.collection("pendingEvents").add(pendingEventData);
      })
      .then((data) => {
        return db
          .collection("pendingEvents")
          .doc(data.id)
          .update({ activityID: data.id });
      })
      .then(() => {
        if (toDeleteEventID)
          dispatch(handleDeleteClubEvent(toDeleteEventID, clubID, false));
        dispatch({ type: STOP_LOADING_DATA });
        dispatch({
          type: ADD_CLUB_EVENT,
          payload: { event: { ...data } },
        });
        Toast.show({
          type: "success",
          text1: `Submitted event request successfully`,
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
  db.collection("clubs")
    .doc(clubID)
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

export const setClubEventToFalse = (clubID, campusID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.collection("clubs")
    .doc(clubID)
    .update({ events: false, status: "inactive" })
    .then(() => {
      return db.collection("clubsOverview").doc(campusID).get();
    })
    .then((doc) => {
      const temp = [...doc.data().clubs];
      const index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].status = "inactive";

      return db
        .collection("clubsOverview")
        .doc(campusID)
        .update({ clubs: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: SET_CLUB_EVENT_TO_FALSE, payload: clubID });
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

export const handleDeleteClubEvent =
  (eventID, clubID, showToastMessage) => (dispatch) => {
    dispatch({ type: SET_LOADING_DATA });
    db.collection("events")
      .doc(clubID)
      .get()
      .then((doc) => {
        const temp = [...doc.data().events];
        const index = temp.findIndex((events) => events.eventID === eventID);
        temp.splice(index, 1);
        return db
          .collection("events")
          .doc(clubID)
          .update({ events: [...temp] });
      })
      .then(() => {
        dispatch({ type: STOP_LOADING_DATA });
        dispatch({ type: DELETE_EVENT, payload: eventID });
        if (showToastMessage)
          Toast.show({
            type: "success",
            text1: `Event deleted successfully`,
          });
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: STOP_LOADING_DATA });
        if (showToastMessage)
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
      });
  };

//edit details -> update redux locally in clubData.club
export const handleUpdateClubDetails = (clubID, data) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.collection("clubs")
    .doc(clubID)
    .update({ details: data })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: UPDATE_CLUB_DETAILS, payload: data });
      Toast.show({
        type: "success",
        text1: "Club details updated successfully.",
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

export const handleActivateClub = (clubID, campusID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.collection("clubs")
    .doc(clubID)
    .update({ status: "active" })
    .then(() => {
      return db.collection("clubsOverview").doc(campusID).get();
    })
    .then((doc) => {
      const temp = [...doc.data().clubs];
      const index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].status = "active";

      return db
        .collection("clubsOverview")
        .doc(campusID)
        .update({ clubs: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: ACTIVATE_CLUB, payload: clubID });
      Toast.show({
        type: "success",
        text1: "Club activated successfully.",
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

export const handleDeactivateClub =
  (clubID, campusID, showLoading) => (dispatch) => {
    if (showLoading) dispatch({ type: SET_LOADING_DATA });
    db.collection("clubs")
      .doc(clubID)
      .update({ status: "inactive" })
      .then(() => {
        return db.collection("clubsOverview").doc(campusID).get();
      })
      .then((doc) => {
        const temp = [...doc.data().clubs];
        const index = temp.findIndex((club) => club.clubID === clubID);
        temp[index].status = "inactive";

        return db
          .collection("clubsOverview")
          .doc(campusID)
          .update({ clubs: [...temp] });
      })
      .then(() => {
        if (showLoading) {
          dispatch({ type: STOP_LOADING_DATA });
          Toast.show({
            type: "success",
            text1: "Club deactivated successfully.",
          });
        }
        dispatch({ type: DEACTIVATE_CLUB, payload: clubID });
      })
      .catch((error) => {
        console.error(error);
        if (showLoading) dispatch({ type: STOP_LOADING_DATA });
        Toast.show({
          type: "error",
          text1: "Something went wrong",
        });
      });
  };

//accepting a new member
export const acceptNewMember = (data, clubID) => (dispatch) => {
  //clubsData = user's club data to be added under users collection in clubs field
  dispatch({ type: SET_LOADING_DATA });

  data.isFirstTime = true;

  //add to clubMembers -> clubID -> members
  db.collection("clubMembers")
    .doc(clubID)
    .get()
    .then((doc) => {
      const temp = [...doc.data().members];
      temp.push(data);
      return db
        .collection("clubMembers")
        .doc(clubID)
        .update({ members: [...temp] });
    })
    .then(() => {
      //update users -> userID -> clubs -> approval: approved
      return db.collection("users").doc(data.userID).get();
    })
    .then((doc) => {
      const temp = [...doc.data().clubs];
      const index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].approval = "approved";

      return db
        .collection("users")
        .doc(data.userID)
        .update({ clubs: [...temp] });
    })
    .then(() => {
      //remove member from club -> clubID -> membersRequests
      return db.collection("clubs").doc(clubID).get();
    })
    .then((doc) => {
      const temp = [...doc.data().membersRequests];
      const index = temp.findIndex((member) => member.userID === data.userID);
      temp.splice(index, 1);

      return db
        .collection("clubs")
        .doc(clubID)
        .update({ membersRequests: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: ACCEPT_NEW_CLUB_MEMBER, payload: data });
      Toast.show({
        type: "success",
        text1: "Member accepted successfully.",
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

//joining a club
export const joinClub = (data, userClubData, clubID) => (dispatch) => {
  //remove any existing data in users/clubs relating to the clubID

  //add data to club's membersRequests and user's clubs
  dispatch({ type: SET_LOADING_DATA });

  db.collection("clubs")
    .doc(clubID)
    .get()
    .then((doc) => {
      const temp = [...doc.data().membersRequests];
      temp.push(data);

      return db
        .collection("clubs")
        .doc(clubID)
        .update({ membersRequests: [...temp] });
    })
    .then(() => {
      return db.collection("users").doc(data.userID).get();
    })
    .then((doc) => {
      const temp = [...doc.data().clubs];
      const index = temp.findIndex((club) => club.clubID === clubID);
      if (index !== -1) temp.splice(index, 1);
      temp.push(userClubData);

      return db
        .collection("users")
        .doc(data.userID)
        .update({ clubs: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: JOIN_CLUB, payload: data });
      Toast.show({
        type: "success",
        text1: "Request sent, please await approval.",
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

//something wrong with this one!!!

//rejecting a new member
export const rejectNewMember = (userID, clubID) => (dispatch) => {
  //update data in users/clubs -> approval:rejected
  //give reason -> rejected:reason
  //show reason in frontend? as notification?
  //just keep reason first for now
  //add data to club's membersRequests

  dispatch({ type: SET_UI_LOADING });

  db.collection("clubs")
    .doc(clubID)
    .get()
    .then((doc) => {
      const temp = [...doc.data().membersRequests];
      const index = temp.findIndex((club) => club.userID === userID);
      temp.splice(index, 1);

      return db
        .collection("clubs")
        .doc(clubID)
        .update({ membersRequests: [...temp] });
    })
    .then(() => {
      return db.collection("users").doc(userID).get();
    })
    .then((doc) => {
      const temp = [...doc.data().clubs];
      const index = temp.findIndex((club) => club.userID === userID);
      temp[index].approval = "rejected";

      return db
        .collection("users")
        .doc(userID)
        .update({ clubs: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_UI_LOADING });
      dispatch({ type: REJECT_NEW_CLUB_MEMBER, payload: userID });
      Toast.show({
        type: "success",
        text1: "Member request rejected successfully",
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_UI_LOADING });
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    });
};

//how to send details of both members when assigning role for member from another member

//assigning a new role to committee members
export const assignNewClubRole =
  (role, newMember, clubID, previousMember, prevRole, secondRound) =>
  (dispatch) => {
    //update in: clubs -> roles -> roleName -> memberID & userID
    dispatch({ type: SET_LOADING_DATA });
    db.collection("clubs")
      .doc(clubID)
      .get()
      .then((doc) => {
        if (role === "member" && prevRole) {
          //handling changing user's current role to a member's role
          //eg treasurer -> member
          const temp = { ...doc.data().roles };
          const tempRole = prevRole.split(" ").join("");
          temp[tempRole].userID = "";
          temp[tempRole].memberID = "";
          return db
            .collection("clubs")
            .doc(clubID)
            .update({ roles: { ...temp } });
        } else if (role === "member" && !prevRole) {
        } else {
          const temp = { ...doc.data().roles };
          const tempRole = role.split(" ").join("");
          temp[tempRole].userID = newMember.userID;
          temp[tempRole].memberID = newMember.memberID;

          //check if current member has a previous role, if yes, reset it.
          if (newMember.role !== "member") {
            const tempRole = newMember.role.split(" ").join("");
            temp[tempRole].userID = "";
            temp[tempRole].memberID = "";
          }

          return db
            .collection("clubs")
            .doc(clubID)
            .update({ roles: { ...temp } });
        }
      })
      .then(() => {
        //update in: users -> clubs -> role
        return db.collection("users").doc(newMember.userID).get();
      })
      .then((doc) => {
        const temp = [...doc.data().clubs];
        const index = temp.findIndex((club) => club.clubID === clubID);
        temp[index].role = role;

        return db
          .collection("users")
          .doc(newMember.userID)
          .update({ clubs: [...temp] });
      })
      .then(() => {
        //update in: clubMembers -> members -> userID -> role
        return db.collection("clubMembers").doc(clubID).get();
      })
      .then((doc) => {
        const temp = [...doc.data().members];
        const index = temp.findIndex(
          (user) => user.userID === newMember.userID
        );
        temp[index].role = role;

        return db
          .collection("clubMembers")
          .doc(clubID)
          .update({ members: [...temp] });
      })
      .then(() => {
        //if previous member, change that member's role to "member"
        //else proceed as usual
        if (previousMember) {
          dispatch(
            assignNewClubRole(
              "member",
              previousMember,
              clubID,
              undefined,
              undefined,
              true
            )
          );
        }
        if (!secondRound) {
          dispatch({ type: STOP_LOADING_DATA });
          dispatch({
            type: ASSIGN_NEW_CLUB_ROLE,
            payload: { newMember, previousMember, role, prevRole },
          });
          Toast.show({
            type: "success",
            text1: "Roles assigned successfully.",
          });
        } else {
          dispatch({ type: STOP_LOADING_DATA });
        }
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

export const addNewClubRole = (roleID, roleName, clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.collection("clubs")
    .doc(clubID)
    .get()
    .then((doc) => {
      const temp = { ...doc.data().roles };
      temp[roleID] = {
        memberID: "",
        userID: "",
        alternateName: "",
        name: roleName,
      };

      return db
        .collection("clubs")
        .doc(clubID)
        .update({ roles: { ...temp } });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: ADD_NEW_CLUB_ROLE, payload: { roleID, roleName } });
      Toast.show({
        type: "success",
        text1: "added new role successfully.",
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

export const deleteClubRole = (roleID, clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  db.collection("clubs")
    .doc(clubID)
    .get()
    .then((doc) => {
      const temp = { ...doc.data().roles };
      delete temp[roleID];

      return db
        .collection("clubs")
        .doc(clubID)
        .update({ roles: { ...temp } });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: DELETE_CLUB_ROLE, payload: roleID });
      Toast.show({
        type: "success",
        text1: "role deleted successfully.",
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

export const deactivateClubMember = (userID, clubID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });

  //remove member from clubMembers
  //remove club from users -> member
  db.collection("clubMembers")
    .doc(clubID)
    .get()
    .then((doc) => {
      const temp = [...doc.data().members];
      const index = temp.findIndex((member) => member.userID === userID);
      temp.splice(index, 1);

      return db
        .collection("clubMembers")
        .doc(clubID)
        .update({ members: [...temp] });
    })
    .then(() => {
      return db.collection("users").doc(userID).get();
    })
    .then((doc) => {
      const temp = [...doc.data().clubs];
      const index = temp.findIndex((club) => club.clubID === clubID);
      temp.splice(index, 1);

      return db
        .collection("users")
        .doc(userID)
        .update({ clubs: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: DEACTIVATE_CLUB_MEMBER, payload: userID });
      Toast.show({
        type: "success",
        text1: "member removed successfully.",
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

export const updateClubImage = (clubID, photoUrl, campusID) => (dispatch) => {
  db.collection("clubs")
    .doc(clubID)
    .update({ image: photoUrl })
    .then(() => {
      return db.collection("clubsOverview").doc(campusID).get();
    })
    .then((doc) => {
      const temp = [...doc.data().clubs];
      const index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].image = photoUrl;

      return db
        .collection("clubsOverview")
        .doc(campusID)
        .update({ clubs: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_UI_LOADING });
      dispatch({ type: UPDATE_CLUB_IMAGE, payload: photoUrl });
      Toast.show({
        type: "success",
        text1: "club image updated successfully.",
      });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: STOP_UI_LOADING });
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    });
};

//   preText: (text to go along source name)
//   postText:
//   sourceID: (id of source eg: club, user profile, event etc)
//   sourceName: (name of source eg: club name, user name, event name etc)
//   sourceImage:
//   sourceDestination: (destination of source: which page to navigate to)
//   defaultText: (for normal notifications with no available source names or ids)
//   read: false,
//   userID,
//   createdAt,
//   notificationID: "",

//   preText: "",
//   postText: "",
//   sourceID: "",
//   sourceName: "",
//   sourceImage: "",
//   sourceDestination: "",
//   defaultText: "",
//   read: false,
//   userID: "",
//   createdAt: new Date().toISOString(),
//   notificationID: "",
export const createNotification = (notification, userIDs) => (dispatch) => {
  //userIDs type array
  const batch = db.batch();

  userIDs.forEach((userID) => {
    const ref = db.collection("notifications").doc();
    notification.notificationID = ref.id;
    notification.userID = userID;
    batch.set(ref, notification);
  });
  batch
    .commit()
    .then(() => {})
    .catch((error) => console.error(error));
};

//function to batch set notifications read to true
//update in redux as well
//receive notification IDs from frontEnd
export const setNotificationsRead = (notificationIDs) => (dispatch) => {
  const batch = db.batch();

  dispatch({ type: SET_NOTIFICATION_AVAILABLE, payload: false });

  notificationIDs.forEach((notificationID) => {
    const notification = db.collection("notifications").doc(notificationID);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {})
    .catch((error) => console.error(error));
};

export const sendAdminNotification =
  (type, clubName, sa, saName, campusID) => (dispatch) => {
    const data = {
      type,
      clubName,
      sa,
      saName,
    };
    auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((idToken) => {
          axios
            .post(
              `https://asia-southeast1-astral-d3ff5.cloudfunctions.net/api/notification/email/${campusID}`,
              data,
              { headers: { Authorization: `Bearer ${idToken}` } }
            )
            .then((res) => {})
            .catch((error) => console.error(error));
        });
      }
    });
  };

export const sendPushNotification =
  (notification, userIDs, campusID) => (dispatch) => {
    const data = {
      notification: { ...notification },
      userIDs: [...userIDs],
    };

    auth().onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((idToken) => {
          axios
            .post(
              `https://asia-southeast1-astral-d3ff5.cloudfunctions.net/api/notification/${campusID}`,
              data,
              { headers: { Authorization: `Bearer ${idToken}` } }
            )
            .then((res) => {})
            .catch((error) => console.error(error));
        });
      }
    });
  };

export const setClubFirstTimeToFalse = (clubID) => (dispatch) => {
  db.collection("clubs")
    .doc(clubID)
    .update({ isFirstTime: false })
    .then(() => {})
    .catch((error) => {
      console.error(error);
    });
};

export const addNewPost = (post) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  let postID;
  db.collection("posts")
    .add(post)
    .then((data) => {
      postID = data.id;
      return db.collection("posts").doc(data.id).update({ postID: data.id });
    })
    .then(() => {
      Toast.show({
        type: "success",
        text1: "new post added successfully.",
      });
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({
        type: ADD_NEW_POST,
        payload: {
          ...post,
          postID,
        },
      });
    })
    .catch((error) => {
      dispatch({ type: STOP_UI_LOADING });
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
      console.error(error);
      dispatch({ type: STOP_LOADING_DATA });
    });
};
