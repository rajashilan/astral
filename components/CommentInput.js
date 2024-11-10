import React, { forwardRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import CustomTextInput from "./CustomTextInput";
import FastImage from "react-native-fast-image";
import arrowIcon from "../assets/arrow_up.png";
import smallCloseIcon from "../assets/small_close_icon.png";
import { useDispatch, useSelector } from "react-redux";
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from "../utils/responsive-font";
import firestore from "@react-native-firebase/firestore";
import { ADD_NEW_COMMENT, SET_COMMENTS_COUNT_EVENT } from "../src/redux/type";
import * as Crypto from "expo-crypto";

const db = firestore();

const CommentInput = forwardRef((props, ref) => {
  const { postID, commentID, replyToCommentID, replyTo, level } = props.data;
  const { handleResetCommentInputState, context } = props;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.credentials);

  const [text, setText] = useState("");

  const [buttonBottomMargin, setButtonBottonMargin] = useState(0);
  const [isFirstTimeCalculatingLayout, setIsFirstTimeCalculatingLayout] =
    useState(true);

  const postComment = () => {
    let commentData = {
      commentID: Crypto.randomUUID(),
      postID,
      text,
      replyTo,
      replyToCommentID,
      level,
      username: user.username,
      createdByImageUrl: user.profileImage,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    dispatch({ type: ADD_NEW_COMMENT, payload: commentData });
    if (context === "events") {
      dispatch({ type: SET_COMMENTS_COUNT_EVENT, payload: commentData });
    }

    //if replyToCommentID, push under that comment's replies
    //else, create new comment doc
    if (commentData.replyToCommentID === "") {
      db.collection("comments")
        .add(commentData)
        .then((data) => {
          //do nothing
        })
        .catch((error) => {
          console.error(error);
          dispatch({ type: STOP_LOADING_DATA });
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
        });
    } else {
      db.collection("comments")
        .where("commentID", "==", commentData.replyToCommentID)
        .get()
        .then((data) => {
          let temp = [...data.docs[0].data().replies];
          temp.push(commentData);
          return db
            .collection("comments")
            .doc(data.docs[0].id)
            .update({
              replies: [...temp],
            });
        })
        .then(() => {})
        .catch((error) => {
          console.error(error);
          dispatch({ type: STOP_LOADING_DATA });
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
        });
    }
    handleResetCommentInputState();
    setText("");

    //increment comments count in posts
    db.collection("posts")
      .doc(postID)
      .get()
      .then((doc) => {
        let count = doc.data().commentsCount;
        count += 1;
        return db
          .collection("posts")
          .doc(postID)
          .update({ commentsCount: count });
      })
      .then(() => {
        //do nothing
      });
  };

  const calculateCommentInputHeight = (e) => {
    const { height } = e.nativeEvent.layout;
    if (isFirstTimeCalculatingLayout) {
      let margin = Math.round((height - 38) / 2);
      setButtonBottonMargin(margin);
      setIsFirstTimeCalculatingLayout(false);
      console.log(margin);
    }
  };

  return (
    <View
      style={{
        flexDirection: "column",
        borderTopWidth: 1,
        borderStyle: "solid",
        borderTopColor: "#232F52",
        paddingTop: pixelSizeVertical(14),
        paddingBottom: pixelSizeVertical(32),
      }}
    >
      <Text
        style={{
          fontSize: fontPixel(12),
          fontWeight: "400",
          color: "#C6CDE2",
          textAlign: "center",
        }}
      >
        Please be respectful when commenting.
      </Text>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TextInput
          ref={ref}
          onLayout={calculateCommentInputHeight}
          placeholder={
            level === 1
              ? "add a comment..."
              : replyTo === user.username
                ? "replying to yourself"
                : `replying to @${replyTo}`
          }
          placeholderTextColor="#A7AFC7"
          value={text}
          multiline={true}
          numberOfLines={1}
          onChangeText={(text) => setText(text)}
          textAlignVertical="top"
          style={{
            backgroundColor: "#1A2238",
            paddingRight: pixelSizeHorizontal(12),
            paddingLeft: pixelSizeHorizontal(12),
            paddingTop: pixelSizeVertical(16),
            paddingBottom: pixelSizeVertical(16),
            fontSize: fontPixel(14),
            fontWeight: "400",
            color: "#DFE5F8",
            borderRadius: 5,
            marginTop: pixelSizeVertical(10),
            width: "85%",
            fontSize: fontPixel(14),
          }}
        />
        <Pressable
          style={{
            backgroundColor: "#07BEB8",
            paddingRight: pixelSizeHorizontal(16),
            paddingLeft: pixelSizeHorizontal(16),
            marginTop: "auto",
            marginBottom: buttonBottomMargin,
            marginLeft: "auto",
            width: widthPixel(38),
            height: heightPixel(38),
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 5,
          }}
          onPress={postComment}
        >
          <FastImage
            style={{
              height: pixelSizeVertical(15),
              width: pixelSizeHorizontal(15),
            }}
            source={arrowIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>
    </View>
  );
});

export default CommentInput;
