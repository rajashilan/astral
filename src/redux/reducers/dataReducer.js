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
  LOGOUT,
  REJECT_NEW_CLUB_MEMBER,
  RESET_CLUB_DATA,
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
    event: [],
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
          event: [...state.clubData.event],
        },
      };
    case RESET_CLUB_DATA:
      return {
        ...state,
        clubData: {
          club: {},
          members: [],
          gallery: [],
          event: [],
          currentMember: {},
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
          event: [...state.clubData.event],
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
          event: [...state.clubData.event],
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
          event: [...state.clubData.event],
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
          event: [...state.clubData.event],
        },
      };
    case SET_CLUB_GALLERY_TO_FALSE:
      let clubGalleryFalse = { ...state.clubData.club };
      clubGalleryFalse.gallery = false;
      clubGalleryFalse.status = "inactive";
      return {
        ...state,
        clubData: {
          club: { ...clubGalleryFalse },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
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
          event: [...state.clubData.event],
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
          event: [...state.clubData.event],
        },
      };
    case DELETE_GALLERY:
      let deleteGalleryTemp = [...state.clubData.gallery];
      let findDeleteGalleryIndex = deleteGalleryTemp.findIndex(
        (gallery) => gallery.galleryID === action.payload
      );
      deleteGalleryTemp.splice(findDeleteGalleryIndex, 1);
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...deleteGalleryTemp],
          event: [...state.clubData.event],
        },
      };
    case SET_CLUB_EVENT_TO_TRUE:
      let clubEventTrue = { ...state.clubData.club };
      clubEventTrue.event = true;
      return {
        ...state,
        clubData: {
          club: { ...clubEventTrue },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case SET_CLUB_EVENT_TO_FALSE:
      let clubEventFalse = { ...state.clubData.club };
      clubEventFalse.event = false;
      clubEventFalse.status = "inactive";
      return {
        ...state,
        clubData: {
          club: { ...clubEventFalse },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case SET_CLUB_EVENT:
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...action.payload.event],
        },
      };
    case ADD_CLUB_EVENT:
      let addClubEventTemp = [...state.clubData.event];
      addClubEventTemp.unshift(action.payload.event);
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...addClubEventTemp],
        },
      };
    case DELETE_EVENT:
      let deleteEventTemp = [...state.clubData.event];
      let findDeleteEventIndex = deleteEventTemp.findIndex(
        (event) => event.eventID === action.payload
      );
      deleteEventTemp.splice(findDeleteEventIndex, 1);
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...deleteEventTemp],
        },
      };
    case UPDATE_CLUB_DETAILS:
      let tempClubDetails = { ...state.clubData.club };
      tempClubDetails.details = action.payload;
      return {
        ...state,
        clubData: {
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
          club: { ...tempClubDetails },
        },
      };
    case ACTIVATE_CLUB:
      let activateClub = { ...state.clubData.club };
      activateClub.status = "active";
      return {
        ...state,
        clubData: {
          club: { ...activateClub },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case DEACTIVATE_CLUB:
      let deactivateClub = { ...state.clubData.club };
      deactivateClub.status = "inactive";
      return {
        ...state,
        clubData: {
          club: { ...deactivateClub },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case ACCEPT_NEW_CLUB_MEMBER:
      let acceptNewClubMemberList = [...state.clubData.members];
      acceptNewClubMemberList.push(action.payload);
      //also remove from membersrequests
      let removeMemberRequestAccept = { ...state.clubData.club };
      let removeMemberRequestAcceptIndex =
        removeMemberRequestAccept.membersRequests.findIndex(
          (member) => member.userID === action.payload.userID
        );
      removeMemberRequestAccept.membersRequests.splice(
        removeMemberRequestAcceptIndex,
        1
      );
      return {
        ...state,
        clubData: {
          club: { ...removeMemberRequestAccept },
          currentMember: { ...state.clubData.currentMember },
          members: [...acceptNewClubMemberList],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case JOIN_CLUB:
      //push to membersRequests
      let tempMembersRequestsClub = { ...state.clubData.club };
      tempMembersRequestsClub.membersRequests.push(action.payload);

      return {
        ...state,
        clubData: {
          club: { ...tempMembersRequestsClub },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case REJECT_NEW_CLUB_MEMBER:
      let rejectClubMember = { ...state.clubData.club };
      let rejectClubMemberIndex = rejectClubMember.membersRequests.findIndex(
        (member) => member.userID === action.payload
      );
      rejectClubMember.membersRequests.splice(rejectClubMemberIndex, 1);

      return {
        ...state,
        clubData: {
          club: { ...rejectClubMember },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case ASSIGN_NEW_CLUB_ROLE:
      //update in clubs, clubMembers and currentMember if currentMember userID === previousMember.userID
      let newRoleClub = { ...state.clubData.club };
      let newRoleMembers = [...state.clubData.members];
      let newRoleMembersIndex;
      let newRoleCurrentMember = { ...state.clubData.currentMember };

      //if previous member exists, set the previous member's role to "member" in clubData.members
      if (action.payload.previousMember) {
        newRoleMembersIndex = newRoleMembers.findIndex(
          (member) => member.userID === action.payload.previousMember.userID
        );
        newRoleMembers[newRoleMembersIndex].role = "member";
      }

      //if the president's role is changed, set the current president's role as "member" in currentMember
      if (action.payload.role === "president")
        newRoleCurrentMember.role = "member";

      //if the role isnt a member then set the newMember IDs in club.roles
      if (action.payload.role !== "member") {
        newRoleClub.roles[action.payload.role.split(" ").join("")].userID =
          action.payload.newMember.userID;
        newRoleClub.roles[action.payload.role.split(" ").join("")].memberID =
          action.payload.newMember.memberID;
      } else {
        //if it is a member, then set the member's previous role IDs to empty in club.roles
        newRoleClub.roles[action.payload.prevRole.split(" ").join("")].userID =
          "";
        newRoleClub.roles[
          action.payload.prevRole.split(" ").join("")
        ].memberID = "";
      }

      //find and set the new member's role in clubData.members
      newRoleMembersIndex = newRoleMembers.findIndex(
        (member) => member.userID === action.payload.newMember.userID
      );
      newRoleMembers[newRoleMembersIndex].role = action.payload.role;

      return {
        ...state,
        clubData: {
          club: { ...newRoleClub },
          currentMember: { ...newRoleCurrentMember },
          members: [...newRoleMembers],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case ADD_NEW_CLUB_ROLE:
      let addNewRoleClub = { ...state.clubData.club };
      addNewRoleClub.roles[action.payload.roleID] = {
        memberID: "",
        userID: "",
        alternateName: "",
        name: action.payload.roleName,
      };

      return {
        ...state,
        clubData: {
          club: { ...addNewRoleClub },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case DELETE_CLUB_ROLE:
      let deleteRoleClub = { ...state.clubData.club };
      delete deleteRoleClub.roles[action.payload];

      return {
        ...state,
        clubData: {
          club: { ...deleteRoleClub },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case DEACTIVATE_CLUB_MEMBER:
      let deactivateMembers = [...state.clubData.members];
      let deactivateMembersIndex = deactivateMembers.findIndex(
        (member) => member.userID === action.payload
      );
      deactivateMembers.splice(deactivateMembersIndex, 1);

      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...deactivateMembers],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case UPDATE_CLUB_IMAGE:
      let updateImageClub = { ...state.clubData.club };
      updateImageClub.image = action.payload;

      return {
        ...state,
        clubData: {
          club: { ...updateImageClub },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    case LOGOUT:
      return initialState;
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
