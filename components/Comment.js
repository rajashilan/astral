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
import CommentInput from "./CommentInput";

export default function Comment(props) {
  const { comment, postID, sendCommentInputStateToParent } = props;
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

  const [showReplies, setShowReplies] = useState(false);

  const handleReplyClick = (comment) => {
    const data = {
      postID,
      commentID: "",
      replyTo: comment.username,
      level: comment.level === 1 ? 2 : 3,
      replyToCommentID: comment.commentID,
    };
    sendCommentInputStateToParent(data);
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: pixelSizeVertical(24),
        }}
      >
        <FastImage
          style={{
            width: widthPixel(40),
            height: heightPixel(40),
            marginBottom: "auto",
            borderRadius: 50,
          }}
          resizeMode="cover"
          source={{
            uri: comment.createdByImageUrl,
          }}
          progressiveRenderingEnabled={true}
          cache={FastImage.cacheControl.immutable}
          priority={FastImage.priority.normal}
        />
        <View
          style={{
            flexDirection: "column",
            marginLeft: pixelSizeHorizontal(5),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                fontSize: fontPixel(14),
                fontWeight: "500",
                color: "#DFE5F8",
                marginBottom: pixelSizeVertical(2),
              }}
            >
              {comment.username}
            </Text>
            <Text
              style={{
                fontSize: fontPixel(10),
                fontWeight: "400",
                color: "#C6CDE2",
                marginLeft: pixelSizeHorizontal(4),
              }}
            >
              {dayjs(comment.createdAt.split("T")[0]).fromNow()}
            </Text>
          </View>
          <Text
            style={{
              fontSize: fontPixel(14),
              fontWeight: "400",
              color: "#C6CDE2",
              marginBottom: pixelSizeVertical(2),
            }}
          >
            {comment.text}
          </Text>
          <Pressable onPress={() => handleReplyClick(comment)}>
            <Text
              style={{
                fontSize: fontPixel(12),
                fontWeight: "500",
                color: "#A7AFC7",
                marginTop: pixelSizeVertical(2),
              }}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              reply
            </Text>
          </Pressable>
          {comment.replies.length > 0 ? (
            <Pressable>
              <Text
                style={{
                  fontSize: fontPixel(12),
                  fontWeight: "500",
                  color: "#A7AFC7",
                  marginTop: pixelSizeVertical(10),
                  paddingLeft: pixelSizeHorizontal(24),
                }}
                onPress={() => setShowReplies(!showReplies)}
              >
                {!showReplies
                  ? `view ${comment.replies.length} ${comment.replies.length === 1 ? "reply" : "replies"}`
                  : `hide ${comment.replies.length === 1 ? "reply" : "replies"}`}
              </Text>
            </Pressable>
          ) : null}
          {showReplies
            ? comment.replies.map((reply) => {
                return (
                  <View
                    key={reply.commentID}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: pixelSizeVertical(24),
                    }}
                  >
                    <FastImage
                      style={{
                        width: widthPixel(40),
                        height: heightPixel(40),
                        marginBottom: "auto",
                        borderRadius: 50,
                      }}
                      resizeMode="cover"
                      source={{
                        uri: reply.createdByImageUrl,
                      }}
                      progressiveRenderingEnabled={true}
                      cache={FastImage.cacheControl.immutable}
                      priority={FastImage.priority.normal}
                    />
                    <View
                      style={{
                        flexDirection: "column",
                        marginLeft: pixelSizeHorizontal(5),
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: fontPixel(14),
                            fontWeight: "500",
                            color: "#DFE5F8",
                            marginBottom: pixelSizeVertical(2),
                          }}
                        >
                          {reply.username}
                        </Text>
                        <Text
                          style={{
                            fontSize: fontPixel(10),
                            fontWeight: "400",
                            color: "#C6CDE2",
                            marginLeft: pixelSizeHorizontal(4),
                          }}
                        >
                          {dayjs(reply.createdAt.split("T")[0]).fromNow()}
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row" }}>
                        {reply.level === 3 ? (
                          <Text
                            style={{
                              fontSize: fontPixel(14),
                              fontWeight: "400",
                              color: "#8C91FB",
                              marginBottom: pixelSizeVertical(2),
                            }}
                          >
                            @{reply.replyTo}{" "}
                          </Text>
                        ) : null}
                        <Text
                          style={{
                            fontSize: fontPixel(14),
                            fontWeight: "400",
                            color: "#C6CDE2",
                            marginBottom: pixelSizeVertical(2),
                          }}
                        >
                          {reply.text}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() =>
                          handleReplyClick({
                            username: reply.username,
                            level: reply.level,
                            commentID: comment.commentID, //pass in the original comment id as the reply to id as we want to push the comment under the original comment's replies and not the subcomment replies
                          })
                        }
                      >
                        <Text
                          style={{
                            fontSize: fontPixel(12),
                            fontWeight: "500",
                            color: "#A7AFC7",
                            marginTop: pixelSizeVertical(2),
                          }}
                          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                        >
                          reply
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })
            : null}
        </View>
      </View>
    </>
  );
}
