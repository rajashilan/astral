import {
  ACCEPT_NEW_CLUB_MEMBER,
  ACTIVATE_CLUB,
  ADD_CLUB_EVENT,
  ADD_CLUB_GALLERY,
  ADD_NEW_CLUB_ROLE,
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
  STOP_LOADING_DATA,
  UPDATE_CLUB_DETAILS,
  UPDATE_CLUB_IMAGE,
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

export const setClubGalleryToFalse = (clubID, campusID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.doc(`/clubs/${clubID}`)
    .update({ gallery: false, status: "inactive" })
    .then(() => {
      return db.doc(`/clubsOverview/${campusID}`).get();
    })
    .then((doc) => {
      let temp = [...doc.data().clubs];
      let index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].status = "inactive";

      return db.doc(`/clubsOverview/${campusID}`).update({ clubs: [...temp] });
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

export const setClubEventToFalse = (clubID, campusID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.doc(`/clubs/${clubID}`)
    .update({ events: false, status: "inactive" })
    .then(() => {
      return db.doc(`/clubsOverview/${campusID}`).get();
    })
    .then((doc) => {
      let temp = [...doc.data().clubs];
      let index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].status = "inactive";

      return db.doc(`/clubsOverview/${campusID}`).update({ clubs: [...temp] });
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

//edit details -> update redux locally in clubData.club
export const handleUpdateClubDetails = (clubID, data) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.doc(`/clubs/${clubID}`)
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
  db.doc(`/clubs/${clubID}`)
    .update({ status: "active" })
    .then(() => {
      return db.doc(`/clubsOverview/${campusID}`).get();
    })
    .then((doc) => {
      let temp = [...doc.data().clubs];
      let index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].status = "active";

      return db.doc(`/clubsOverview/${campusID}`).update({ clubs: [...temp] });
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

export const handleDeactivateClub = (clubID, campusID) => (dispatch) => {
  dispatch({ type: SET_LOADING_DATA });
  db.doc(`/clubs/${clubID}`)
    .update({ status: "inactive" })
    .then(() => {
      return db.doc(`/clubsOverview/${campusID}`).get();
    })
    .then((doc) => {
      let temp = [...doc.data().clubs];
      let index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].status = "inactive";

      return db.doc(`/clubsOverview/${campusID}`).update({ clubs: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: DEACTIVATE_CLUB, payload: clubID });
      Toast.show({
        type: "success",
        text1: "Club deactivated successfully.",
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

//accepting a new member
export const acceptNewMember = (data, clubID) => (dispatch) => {
  //clubsData = user's club data to be added under users collection in clubs field
  dispatch({ type: SET_LOADING_DATA });

  //add to clubMembers -> clubID -> members
  db.doc(`/clubMembers/${clubID}`)
    .get()
    .then((doc) => {
      let temp = [...doc.data().members];
      temp.push(data);
      return db.doc(`/clubMembers/${clubID}`).update({ members: [...temp] });
    })
    .then(() => {
      //update users -> userID -> clubs -> approval: approved
      return db.doc(`/users/${data.userID}`).get();
    })
    .then((doc) => {
      let temp = [...doc.data().clubs];
      let index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].approval = "approved";

      return db.doc(`/users/${data.userID}`).update({ clubs: [...temp] });
    })
    .then(() => {
      //remove member from club -> clubID -> membersRequests
      return db.doc(`/clubs/${clubID}`).get();
    })
    .then((doc) => {
      let temp = [...doc.data().membersRequests];
      let index = temp.findIndex((member) => member.userID === data.userID);
      temp.splice(index, 1);

      return db.doc(`/clubs/${clubID}`).update({ membersRequests: [...temp] });
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

  db.doc(`/clubs/${clubID}`)
    .get()
    .then((doc) => {
      let temp = [...doc.data().membersRequests];
      temp.push(data);

      return db.doc(`/clubs/${clubID}`).update({ membersRequests: [...temp] });
    })
    .then(() => {
      return db.doc(`/users/${data.userID}`).get();
    })
    .then((doc) => {
      let temp = [...doc.data().clubs];
      let index = temp.findIndex((club) => club.clubID === clubID);
      if (index !== -1) temp.splice(index, 1);
      temp.push(userClubData);

      return db.doc(`/users/${data.userID}`).update({ clubs: [...temp] });
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

  dispatch({ type: SET_LOADING_DATA });

  db.doc(`/clubs/${clubID}`)
    .get()
    .then((doc) => {
      let temp = [...doc.data().membersRequests];
      let index = temp.findIndex((club) => club.userID === userID);
      temp.splice(index, 1);

      return db.doc(`/clubs/${clubID}`).update({ membersRequests: [...temp] });
    })
    .then(() => {
      return db.doc(`/users/${userID}`).get();
    })
    .then((doc) => {
      let temp = [...doc.data().clubs];
      let index = temp.findIndex((club) => club.userID === userID);
      temp[index].approval = "rejected";

      return db.doc(`/users/${userID}`).update({ clubs: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: REJECT_NEW_CLUB_MEMBER, payload: userID });
      Toast.show({
        type: "success",
        text1: "Member request rejected successfully",
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

//how to send details of both members when assigning role for member from another member

//assigning a new role to committee members
export const assignNewClubRole =
  (role, newMember, clubID, previousMember, prevRole, secondRound) =>
  (dispatch) => {
    //update in: clubs -> roles -> roleName -> memberID & userID
    dispatch({ type: SET_LOADING_DATA });
    db.doc(`/clubs/${clubID}`)
      .get()
      .then((doc) => {
        if (role === "member" && prevRole) {
          let temp = { ...doc.data().roles };
          let tempRole = prevRole.split(" ").join("");
          temp[tempRole].userID = "";
          temp[tempRole].memberID = "";
          return db.doc(`/clubs/${clubID}`).update({ roles: { ...temp } });
        } else if (role === "member" && !prevRole) {
          return;
        } else {
          let temp = { ...doc.data().roles };
          let tempRole = role.split(" ").join("");
          temp[tempRole].userID = newMember.userID;
          temp[tempRole].memberID = newMember.memberID;

          return db.doc(`/clubs/${clubID}`).update({ roles: { ...temp } });
        }
      })
      .then(() => {
        //update in: users -> clubs -> role
        return db.doc(`/users/${newMember.userID}`).get();
      })
      .then((doc) => {
        let temp = [...doc.data().clubs];
        let index = temp.findIndex((club) => club.clubID === clubID);
        temp[index].role = role;

        return db
          .doc(`/users/${newMember.userID}`)
          .update({ clubs: [...temp] });
      })
      .then(() => {
        //update in: clubMembers -> members -> userID -> role
        return db.doc(`/clubMembers/${clubID}`).get();
      })
      .then((doc) => {
        let temp = [...doc.data().members];
        let index = temp.findIndex((user) => user.userID === newMember.userID);
        temp[index].role = role;

        return db.doc(`/clubMembers/${clubID}`).update({ members: [...temp] });
      })
      .then(() => {
        //if previous member, change that member's role to "member"
        //else proceed as usual
        if (previousMember)
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

  db.doc(`/clubs/${clubID}`)
    .get()
    .then((doc) => {
      let temp = { ...doc.data().roles };
      temp[roleID] = {
        memberID: "",
        userID: "",
        alternateName: "",
        name: roleName,
      };

      return db.doc(`/clubs/${clubID}`).update({ roles: { ...temp } });
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

  db.doc(`/clubs/${clubID}`)
    .get()
    .then((doc) => {
      let temp = { ...doc.data().roles };
      delete temp[roleID];

      return db.doc(`/clubs/${clubID}`).update({ roles: { ...temp } });
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
  db.doc(`/clubMembers/${clubID}`)
    .get()
    .then((doc) => {
      let temp = [...doc.data().members];
      let index = temp.findIndex((member) => member.userID === userID);
      temp.splice(index, 1);

      return db.doc(`/clubMembers/${clubID}`).update({ members: [...temp] });
    })
    .then(() => {
      return db.doc(`/users/${userID}`).get();
    })
    .then((doc) => {
      let temp = [...doc.data().clubs];
      let index = temp.findIndex((club) => club.clubID === clubID);
      temp.splice(index, 1);

      return db.doc(`/users/${userID}`).update({ clubs: [...temp] });
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
  dispatch({ type: SET_LOADING_DATA });

  db.doc(`/clubs/${clubID}`)
    .update({ image: photoUrl })
    .then(() => {
      return db.doc(`/clubsOverview/${campusID}`).get();
    })
    .then((doc) => {
      let temp = [...doc.data().clubs];
      let index = temp.findIndex((club) => club.clubID === clubID);
      temp[index].image = photoUrl;

      return db.doc(`/clubsOverview/${campusID}`).update({ clubs: [...temp] });
    })
    .then(() => {
      dispatch({ type: STOP_LOADING_DATA });
      dispatch({ type: UPDATE_CLUB_IMAGE, payload: photoUrl });
      Toast.show({
        type: "success",
        text1: "club image updated successfully.",
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
export const createNotification = (notification, userIDs) => (dispatch) => {
  //userIDs type array
  console.log("Called");
  let batch = db.batch();

  userIDs.forEach((userID) => {
    const ref = db.collection("notifications").doc();
    notification.notificationID = ref.id;
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
  let batch = db.batch();

  notificationIDs.forEach((notificationID) => {
    const notification = db.doc(`/notifications/${notificationID}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {})
    .catch((error) => console.error(error));
};
