import React from "react";
import { Pressable, View, Alert } from "react-native";
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from "../../utils/responsive-font";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import {
  deletePost,
  reportPost,
  sendAdminNotification,
} from "../../src/redux/actions/dataActions";

export default function PostOptions(props) {
  const { postID, createdBy } = props;
  //need postID, createdBy currentUserID to report or delete

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.credentials);
  const club = useSelector((state) => state.data.clubData.club);
  const campusID = useSelector((state) => state.data.campus.campusID);
  const loading = useSelector((state) => state.data.loading);
  const currentUserID = user.userId;

  //for report option to be available: currentUserID !== createdBy
  //for delete option to be available: currentUserID === createdBy

  const onReportSelected = () => {
    Alert.alert("Report post", "Are you sure you want to report this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Report",
        onPress: () => handleReportPost(),
        style: "destructive",
      },
    ]);
  };

  const onDeleteSelected = () => {
    Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => handleDeletePost(),
        style: "destructive",
      },
    ]);
  };

  const handleDeletePost = () => {
    dispatch(deletePost(postID));
  };

  const handleReportPost = () => {
    dispatch(reportPost(postID, currentUserID));
    dispatch(sendAdminNotification("report", club.name, "", "", campusID));
  };

  return (
    <Menu
      style={{
        flexDirection: "row",
        marginLeft: "auto",
      }}
    >
      {!loading ? (
        <MenuTrigger
          style={{
            flexDirection: "row",
            marginLeft: "auto",
            height: heightPixel(20),
            paddingTop: pixelSizeVertical(10),
            backgroundColor: "#0C111F",
          }}
        >
          <View
            style={{
              backgroundColor: "#546593",
              borderRadius: 50,
              height: heightPixel(4),
              width: widthPixel(4),
              marginRight: pixelSizeHorizontal(2),
            }}
          />
          <View
            style={{
              backgroundColor: "#546593",
              borderRadius: 50,
              height: heightPixel(4),
              width: widthPixel(4),
              marginRight: pixelSizeHorizontal(2),
            }}
          />
          <View
            style={{
              backgroundColor: "#546593",
              borderRadius: 50,
              height: heightPixel(4),
              width: widthPixel(4),
            }}
          />
        </MenuTrigger>
      ) : (
        <Loader
          style={{
            marginBottom: 0,
            flexDirection: "row",
            marginLeft: "auto",
            marginBottom: pixelSizeVertical(20),
            marginRight: pixelSizeHorizontal(8),
          }}
          size="small"
        />
      )}
      <MenuOptions
        customStyles={{
          optionsWrapper: {
            borderRadius: 10,
            paddingVertical: pixelSizeVertical(8),
            paddingHorizontal: pixelSizeHorizontal(12),
            backgroundColor: "#232F52",
          },
          optionsContainer: {
            backgroundColor: "transparent",
          },
        }}
      >
        {currentUserID !== createdBy ? (
          <MenuOption
            onSelect={onReportSelected}
            text="Report"
            customStyles={{
              optionText: {
                color: "#DFE5F8",
                fontSize: fontPixel(14),
                fontWeight: "500",
                marginBottom: pixelSizeVertical(4),
              },
            }}
          />
        ) : null}
        {currentUserID === createdBy ? (
          <MenuOption
            onSelect={onDeleteSelected}
            text="Delete"
            customStyles={{
              optionText: {
                color: "#CC3B47",
                fontSize: fontPixel(14),
                fontWeight: "500",
                marginBottom: pixelSizeVertical(4),
              },
            }}
          />
        ) : null}
      </MenuOptions>
    </Menu>
  );
}
