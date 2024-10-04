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
  RESET_ORIENTATION,
  RESET_ORIENTATION_PAGE,
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
    case RESET_ORIENTATION_PAGE:
      return {
        ...state,
        orientation: {
          overview: { ...state.orientation.overview },
          pages: [...state.orientation.pages],
          currentPage: {},
        },
      };
    case RESET_ORIENTATION:
      return {
        ...state,
        orientation: {
          overview: {},
          pages: [],
          currentPage: {},
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
    case SET_CLUB_MEMBERS_DATA: {
      const currentMember = action.payload.members.findIndex(
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
    }
    case UPDATE_CLUB_MEMBER_BIO: {
      const currentMember = state.clubData.members.findIndex(
        (member) => member.userID === action.payload.userID
      );
      state.clubData.members[currentMember].bio = action.payload.bio;
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
    }
    case UPDATE_CLUB_MEMBER_PHOTO: {
      const currentMember = state.clubData.members.findIndex(
        (member) => member.userID === action.payload.userID
      );
      state.clubData.members[currentMember].profileImage =
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
    }
    case SET_CLUB_GALLERY_TO_TRUE: {
      const club = { ...state.clubData.club };
      club.gallery = true;
      return {
        ...state,
        clubData: {
          club: { ...club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case SET_CLUB_GALLERY_TO_FALSE: {
      const club = { ...state.clubData.club };
      club.gallery = false;
      club.status = "inactive";
      return {
        ...state,
        clubData: {
          club: { ...club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
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
    case ADD_CLUB_GALLERY: {
      const gallery = [...state.clubData.gallery];
      gallery.unshift(action.payload.gallery);
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case DELETE_GALLERY: {
      const gallery = [...state.clubData.gallery];
      const index = gallery.findIndex(
        (gallery) => gallery.galleryID === action.payload
      );
      gallery.splice(index, 1);
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case SET_CLUB_EVENT_TO_TRUE: {
      const club = { ...state.clubData.club };
      club.event = true;
      return {
        ...state,
        clubData: {
          club: { ...club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case SET_CLUB_EVENT_TO_FALSE: {
      const club = { ...state.clubData.club };
      club.event = false;
      club.status = "inactive";
      return {
        ...state,
        clubData: {
          club: { ...club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case SET_CLUB_EVENT: {
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
    }
    case ADD_CLUB_EVENT: {
      const event = [...state.clubData.event];
      event.unshift(action.payload.event);
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...event],
        },
      };
    }
    case DELETE_EVENT: {
      const event = [...state.clubData.event];
      const index = event.findIndex(
        (event) => event.eventID === action.payload
      );
      event.splice(index, 1);
      return {
        ...state,
        clubData: {
          club: { ...state.clubData.club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...event],
        },
      };
    }
    case UPDATE_CLUB_DETAILS: {
      const club = { ...state.clubData.club };
      club.details = action.payload;
      return {
        ...state,
        clubData: {
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
          club: { ...club },
        },
      };
    }
    case ACTIVATE_CLUB: {
      let temp = { ...state.clubData.club };
      temp.status = "active";
      return {
        ...state,
        clubData: {
          club: { ...temp },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case DEACTIVATE_CLUB: {
      let temp = { ...state.clubData.club };
      temp.status = "inactive";
      return {
        ...state,
        clubData: {
          club: { ...temp },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case ACCEPT_NEW_CLUB_MEMBER: {
      const acceptNewClubMemberList = [...state.clubData.members];
      acceptNewClubMemberList.push(action.payload);
      //also remove from membersrequests
      const removeMemberRequest = { ...state.clubData.club };
      const removeMemberRequestIndex =
        removeMemberRequest.membersRequests.findIndex(
          (member) => member.userID === action.payload.userID
        );
      removeMemberRequest.membersRequests.splice(removeMemberRequestIndex, 1);
      return {
        ...state,
        clubData: {
          club: { ...removeMemberRequest },
          currentMember: { ...state.clubData.currentMember },
          members: [...acceptNewClubMemberList],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case JOIN_CLUB: {
      //push to membersRequests
      const club = { ...state.clubData.club };
      club.membersRequests.push(action.payload);

      return {
        ...state,
        clubData: {
          club: { ...club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case REJECT_NEW_CLUB_MEMBER: {
      const club = { ...state.clubData.club };
      const index = club.membersRequests.findIndex(
        (member) => member.userID === action.payload
      );
      club.membersRequests.splice(index, 1);

      return {
        ...state,
        clubData: {
          club: { ...club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case ASSIGN_NEW_CLUB_ROLE: {
      //update in clubs, clubMembers and currentMember if currentMember userID === previousMember.userID
      const newRoleClub = { ...state.clubData.club };
      const newRoleMembers = [...state.clubData.members];
      let newRoleMembersIndex;
      const newRoleCurrentMember = { ...state.clubData.currentMember };

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
    }
    case ADD_NEW_CLUB_ROLE: {
      const club = { ...state.clubData.club };
      club.roles[action.payload.roleID] = {
        memberID: "",
        userID: "",
        alternateName: "",
        name: action.payload.roleName,
      };

      return {
        ...state,
        clubData: {
          club: { ...club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case DELETE_CLUB_ROLE: {
      const club = { ...state.clubData.club };
      delete club.roles[action.payload];

      return {
        ...state,
        clubData: {
          club: { ...club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
    case DEACTIVATE_CLUB_MEMBER: {
      const deactivateMembers = [...state.clubData.members];
      const deactivateMembersIndex = deactivateMembers.findIndex(
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
    }
    case UPDATE_CLUB_IMAGE: {
      const club = { ...state.clubData.club };
      club.image = action.payload;

      return {
        ...state,
        clubData: {
          club: { ...club },
          currentMember: { ...state.clubData.currentMember },
          members: [...state.clubData.members],
          gallery: [...state.clubData.gallery],
          event: [...state.clubData.event],
        },
      };
    }
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
