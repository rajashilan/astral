import React, { useEffect, useRef, useState } from "react";
import {
  Pressable,
  Text,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from "../utils/responsive-font";
import Modal from "react-native-modal";
import IosHeight from "./IosHeight";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import CustomTextInput from "./CustomTextInput";
import PrimaryButton from "./PrimaryButton";
import CustomSelectDropdown from "./CustomSelectDropdown";
import * as Crypto from "expo-crypto";
import { addNewPost } from "../src/redux/actions/dataActions";
import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";
import { StatusBar } from "expo-status-bar";
import EmptyView from "./EmptyView";
import CreateAPhotosPost from "./CreateAPhotosPost";
import CreateAFilePost from "./CreateAFilePost";
import WarningDot from "../assets/WarningDot";
import CreateAPollPost from "./CreateAPollPost";
import CreateAnEventPost from "./CreateAnEventPost";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Comment from "./Comment";

export default function CommentsModal(props) {
  dayjs.extend(relativeTime);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.credentials);
  const data = useSelector((state) => state.data.clubData.club);
  const campusID = useSelector((state) => state.data.campus.campusID);
  const loading = useSelector((state) => state.data.loading);
  const UIloading = useSelector((state) => state.UI.loading);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const members = useSelector((state) => state.data.clubData.members);

  const [comments, setComments] = useState([
    {
      commentID: "1",
      postID: "2",
      text: "hellooooo everyone",
      replyTo: "",
      level: 1,
      username: "rajashilan",
      createdByImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/users%2FprofileImage%2Fx5P7nfzOFfaSMrMQF6ZrJZiWXuk2%2Faa4d86f7-580a-4b15-a4a3-ad00ffb4e783.jpg?alt=media&token=eb68a806-2685-443d-810d-6772a0e3b95d",
      createdAt: new Date().toISOString(),
      replies: [
        {
          commentID: "3",
          postID: "2",
          text: "hiiiiii",
          username: "yihow",
          createdAt: new Date().toISOString(),
          replyTo: "rajashilan",
          level: 2,
          createdByImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/users%2FprofileImage%2Fx5P7nfzOFfaSMrMQF6ZrJZiWXuk2%2Faa4d86f7-580a-4b15-a4a3-ad00ffb4e783.jpg?alt=media&token=eb68a806-2685-443d-810d-6772a0e3b95d",
        },
        {
          commentID: "6",
          postID: "2",
          text: "why so excited lmao",
          username: "koay",
          replyTo: "yihow",
          level: 3,
          createdAt: new Date().toISOString(),
          createdByImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/users%2FprofileImage%2Fx5P7nfzOFfaSMrMQF6ZrJZiWXuk2%2Faa4d86f7-580a-4b15-a4a3-ad00ffb4e783.jpg?alt=media&token=eb68a806-2685-443d-810d-6772a0e3b95d",
        },
        {
          commentID: "4",
          postID: "2",
          text: "bro stfu ahahaha",
          username: "kokpeng",
          replyTo: "rajashilan",
          level: 2,
          createdAt: new Date().toISOString(),
          createdByImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/users%2FprofileImage%2Fx5P7nfzOFfaSMrMQF6ZrJZiWXuk2%2Faa4d86f7-580a-4b15-a4a3-ad00ffb4e783.jpg?alt=media&token=eb68a806-2685-443d-810d-6772a0e3b95d",
        },
      ],
    },
    {
      commentID: "2",
      postID: "2",
      level: 1,
      text: "nice one la",
      replyTo: "",
      username: "rajashilan",
      createdAt: new Date().toISOString(),
      createdByImageUrl:
        "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/users%2FprofileImage%2Fx5P7nfzOFfaSMrMQF6ZrJZiWXuk2%2Faa4d86f7-580a-4b15-a4a3-ad00ffb4e783.jpg?alt=media&token=eb68a806-2685-443d-810d-6772a0e3b95d",
      replies: [
        {
          commentID: "3",
          postID: "2",
          text: "hiiiiii",
          username: "yihow",
          createdAt: new Date().toISOString(),
          replyTo: "rajashilan",
          level: 2,
          createdByImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/users%2FprofileImage%2Fx5P7nfzOFfaSMrMQF6ZrJZiWXuk2%2Faa4d86f7-580a-4b15-a4a3-ad00ffb4e783.jpg?alt=media&token=eb68a806-2685-443d-810d-6772a0e3b95d",
        },
      ],
    },
  ]);

  const handlePost = async () => {};

  //   useEffect(() => {
  //     return () => {
  //       setText("");
  //     };
  //   }, []);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#0C111F",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: pixelSizeHorizontal(16),
        flexDirection: "column",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
    >
      <IosHeight />
      <View
        style={{
          height: heightPixel(2),
          backgroundColor: "#F5ECEC",
          borderRadius: 5,
          width: "50%",
          alignSelf: "center",
          marginBottom: pixelSizeVertical(30),
        }}
      />
      <Text
        style={{
          fontSize: fontPixel(16),
          fontWeight: "500",
          color: "#DFE5F8",
          marginBottom: pixelSizeVertical(16),
        }}
      >
        comments
      </Text>
      <ScrollView
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{
          flexDirection: "column",
        }}
      >
        {comments.map((comment) => {
          return <Comment comment={comment} />;
        })}
        <EmptyView />
        <EmptyView />
      </ScrollView>
      {!loading && (
        <Pressable
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            width: "100",
            backgroundColor: "#0C111F",
            paddingBottom: pixelSizeVertical(32),
            paddingTop: pixelSizeVertical(8),
          }}
          onPress={props.callParentScreenFunction}
        >
          <Text
            style={{
              fontSize: fontPixel(16),
              fontWeight: "400",
              color: "#A7AFC7",
              marginTop: pixelSizeVertical(2),
              textAlign: "center",
            }}
          >
            back
          </Text>
        </Pressable>
      )}
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </KeyboardAvoidingView>
  );
}
