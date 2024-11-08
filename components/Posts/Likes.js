import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from "../../utils/responsive-font";
import firestore from "@react-native-firebase/firestore";
import likeEmpty from "../../assets/like_empty.png";
import likeFilled from "../../assets/like_filled.png";
import { useDispatch, useSelector } from "react-redux";
import { ADD_LIKE, REMOVE_LIKE } from "../../src/redux/type";
import LottieView from "lottie-react-native";

const db = firestore();

export default function Likes(props) {
  const dispatch = useDispatch();

  const { postID, likesCount } = props;

  const [isLiked, setIsLiked] = useState(false);
  const [likeID, setLikeID] = useState("");
  const [firstTimeRender, setFirstTimeRender] = useState(true);
  const campusID = useSelector((state) => state.data.campus.campusID);
  const user = useSelector((state) => state.user.credentials);

  useEffect(() => {
    db.collection("likes")
      .where("postID", "==", postID)
      .where("userID", "==", user.userId)
      .get()
      .then((data) => {
        if (!data.empty) {
          const id = data.docs[0]?.data().likeID;
          setLikeID(id);
          setIsLiked(true);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setFirstTimeRender(false);
  }, [postID]);

  const handleLike = () => {
    let likeStatus = !isLiked;
    setIsLiked(likeStatus);

    //show new ui instantly, update in redux instantly
    const likeData = {
      postID,
      likeID: "",
      campusID,
      userID: user.userId,
      username: user.username,
      createdAt: new Date().toISOString(),
    };
    if (likeStatus) {
      dispatch({ type: ADD_LIKE, payload: postID });

      db.collection("likes")
        .add(likeData)
        .then((data) => {
          setLikeID(data.id);
          return db
            .collection("likes")
            .doc(data.id)
            .update({ likeID: data.id });
        })
        .then(() => {
          return db.collection("posts").doc(postID).get();
        })
        .then((doc) => {
          let count = doc.data().likesCount;
          count += 1;
          return db
            .collection("posts")
            .doc(postID)
            .update({ likesCount: count });
        })
        .then(() => {
          //do nothing
        })
        .catch((error) => {
          console.error("1: ", error);
        });
    } else {
      dispatch({ type: REMOVE_LIKE, payload: postID });
      db.collection("likes")
        .doc(likeID)
        .delete()
        .then(() => {
          return db.collection("posts").doc(postID).get();
        })
        .then((doc) => {
          let count = doc.data().likesCount;
          if (count !== 0) {
            count -= 1;
            return db
              .collection("posts")
              .doc(postID)
              .update({ likesCount: count });
          }
        })
        .then(() => {
          //do nothing
        })
        .catch((error) => {
          console.error("2: ", error);
        });
    }
  };

  return (
    <View
      style={{
        borderStyle: "solid",
        borderRadius: 5,
        borderColor: "#232F52",
        borderWidth: 2,
        paddingVertical: pixelSizeVertical(10),
        paddingHorizontal: pixelSizeHorizontal(10),
        marginTop: pixelSizeVertical(14),
        position: "relative", // Make sure the parent view is positioned relative
      }}
    >
      <Pressable
        onPress={handleLike}
        hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        {firstTimeRender || !isLiked ? (
          <FastImage
            style={{
              height: pixelSizeVertical(15),
              width: pixelSizeHorizontal(18),
            }}
            source={isLiked ? likeFilled : likeEmpty}
            resizeMode="contain"
          />
        ) : (
          <LottieView
            style={{
              height: pixelSizeVertical(47), // Height of the animation
              width: pixelSizeHorizontal(51), // Width of the animation
              position: "absolute", // Position absolutely inside the parent
              left: 0, // Position to the left of the container
              top: "50%", // Center it vertically relative to the parent view
              transform: [
                {
                  translateY: -pixelSizeVertical(23),
                },
                {
                  translateX: -pixelSizeHorizontal(17),
                },
              ], // Adjust for perfect centering
            }}
            source={require("../../assets/lottie/liked.json")}
            autoPlay
            loop={false}
          />
        )}
        <Text
          style={{
            fontSize: fontPixel(14),
            fontWeight: "600",
            color: "#DFE5F8",
            marginLeft: isLiked
              ? pixelSizeHorizontal(25)
              : pixelSizeHorizontal(5),
          }}
        >
          {likesCount}
        </Text>
      </Pressable>
    </View>
  );
}
