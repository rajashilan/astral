import React, { useState, useEffect } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import firestore from "@react-native-firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_LIKE,
  ADD_LIKE_EVENT,
  REMOVE_LIKE,
  REMOVE_LIKE_EVENT,
} from "../../src/redux/type";
import LottieView from "lottie-react-native";

const db = firestore();

const Likes = React.memo((props) => {
  const dispatch = useDispatch();
  const { postID, likesCount, context } = props;
  const [isLiked, setIsLiked] = useState(false);
  const [likeID, setLikeID] = useState("");
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
        } else {
          setIsLiked(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [user.userId, postID]);

  const handleLike = () => {
    const likeStatus = !isLiked;
    setIsLiked(likeStatus);

    const likeData = {
      postID,
      likeID: "",
      campusID,
      userID: user.userId,
      username: user.username,
      createdAt: new Date().toISOString(),
    };

    const increment = firestore.FieldValue.increment(1);
    const decrement = firestore.FieldValue.increment(-1);

    if (likeStatus) {
      if (context === "events") {
        dispatch({ type: ADD_LIKE_EVENT, payload: postID });
      }
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
          return db.collection("posts").doc(postID).update({
            likesCount: increment,
          });
        })
        .catch((error) => {
          console.error("1: ", error);
        });
    } else {
      if (context === "events") {
        dispatch({ type: REMOVE_LIKE_EVENT, payload: postID });
      }
      dispatch({ type: REMOVE_LIKE, payload: postID });

      db.collection("likes")
        .doc(likeID)
        .delete()
        .then(() => {
          return db.collection("posts").doc(postID).update({
            likesCount: decrement,
          });
        })
        .catch((error) => {
          console.error("2: ", error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleLike}
        hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        style={styles.pressable}
      >
        {isLiked ? (
          <LottieView
            style={styles.lottie}
            source={require("../../assets/lottie/liked.json")}
            autoPlay
            loop={false}
          />
        ) : (
          <FastImage
            style={styles.icon}
            source={require("../../assets/like_empty.png")}
            resizeMode="contain"
          />
        )}
        <Text style={[styles.text, { marginLeft: isLiked ? 25 : 5 }]}>
          {likesCount}
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    borderStyle: "solid",
    borderRadius: 5,
    borderColor: "#232F52",
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 14,
    position: "relative",
  },
  pressable: {
    flexDirection: "row",
    alignItems: "center",
  },
  lottie: {
    height: 47,
    width: 51,
    position: "absolute",
    left: 0,
    top: "50%",
    transform: [{ translateY: -23 }, { translateX: -17 }],
  },
  icon: {
    height: 15,
    width: 18,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DFE5F8",
  },
});

export default Likes;
