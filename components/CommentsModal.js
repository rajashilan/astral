import React, { useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
  Text,
} from "react-native";
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from "../utils/responsive-font";
import IosHeight from "./IosHeight";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";
import { StatusBar } from "expo-status-bar";
import EmptyView from "./EmptyView";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Comment from "./Comment";
import CommentInput from "./CommentInput";
import firestore from "@react-native-firebase/firestore";
import { RESET_COMMENTS, SET_COMMENTS } from "../src/redux/type";
import Loader from "../components/Loader";

const db = firestore();

const { height } = Dimensions.get("window");

export default function CommentsModal(props) {
  const { postID, context } = props;
  dayjs.extend(relativeTime);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.credentials);
  const comments = useSelector((state) => state.data.clubData.comments);
  const [loading, setLoading] = useState(false);

  const [keyboardVerticalOffset, setKeyboardVerticalOffset] = useState(0);

  //get the comments from here, store in redux
  //reset comments whenever modal is closed
  useEffect(() => {
    setLoading(true);
    db.collection("comments")
      .where("postID", "==", postID)
      .orderBy("createdAt", "asc")
      .get()
      .then((data) => {
        let temp = [];
        data.forEach((doc) => {
          temp.push(doc.data());
        });
        dispatch({ type: SET_COMMENTS, payload: temp });
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        dispatch({ type: STOP_LOADING_DATA });
        Toast.show({
          type: "error",
          text1: "Something went wrong",
        });
        setLoading(false);
      });

    let temp = 0;
    if (Platform.OS === "ios") {
      if (height <= 568) {
        // iPhone SE / small screen sizes
        temp = 175;
      } else if (height <= 812) {
        // iPhone X, XS, 11 Pro, 12 Mini
        temp = 200;
      } else {
        // Larger iPhones, iPhone 12/13/14 Pro Max
        temp = 215;
      }
    } else {
      // Android, customize as needed
      temp = 0;
    }
    setKeyboardVerticalOffset(temp);

    return () => {
      dispatch({ type: RESET_COMMENTS });
    };
  }, []);

  const CommentInputRef = useRef(null);

  //default state, change if reply button clicked, or close button clicked
  const [commentInputState, setCommentInputState] = useState({
    postID,
    commentID: "",
    replyTo: "",
    level: 1,
    replyToCommentID: "",
  });

  const handleReceiveCommentInputState = (comment) => {
    const data = {
      postID,
      commentID: "",
      replyTo: comment.replyTo,
      level: comment.level === 2 ? 2 : 3,
      replyToCommentID: comment.replyToCommentID,
    };
    setCommentInputState(data);
    CommentInputRef.current.focus();
  };

  const handleResetCommentInputState = () => {
    const data = {
      postID,
      commentID: "",
      replyTo: "",
      level: 1,
      replyToCommentID: "",
    };
    setCommentInputState(data);
  };

  const handlePost = async () => {};

  //   useEffect(() => {
  //     return () => {
  //       setText("");
  //     };
  //   }, []);

  let UI = loading ? (
    <Loader />
  ) : (
    <ScrollView
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      style={{
        flexDirection: "column",
      }}
      onTouchStart={handleResetCommentInputState}
    >
      {comments && comments.length > 0 ? (
        comments.map((comment) => {
          return (
            <Comment
              postID={postID}
              comment={comment}
              key={comment.commentID}
              sendCommentInputStateToParent={handleReceiveCommentInputState}
            />
          );
        })
      ) : (
        <Text
          style={{
            fontSize: fontPixel(16),
            fontWeight: "500",
            color: "#DFE5F8",
            textAlign: "center",
            marginTop: pixelSizeVertical(24),
          }}
        >
          Be the first to post a comment!
        </Text>
      )}
      <EmptyView />
      <EmptyView />
    </ScrollView>
  );

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
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <View
        style={{
          height: heightPixel(2),
          backgroundColor: "#F5ECEC",
          borderRadius: 5,
          width: "50%",
          alignSelf: "center",
          marginVertical: pixelSizeVertical(20),
        }}
      />
      {UI}
      <CommentInput
        handleResetCommentInputState={handleResetCommentInputState}
        context={context}
        ref={CommentInputRef}
        data={commentInputState}
      />
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </KeyboardAvoidingView>
  );
}
