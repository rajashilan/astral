import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import FastImage from "react-native-fast-image";
import {
  fontPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from "../../utils/responsive-font";
import firestore from "@react-native-firebase/firestore";
import commentIcon from "../../assets/comment.png";

const db = firestore();

export default function Comments(props) {
  const { postID } = props;
  const [commentsCount, setCommentsCount] = useState(242); //shorten using npm package later TODO
  const [comments, setComments] = useState([]);

  //one db query that caters to both liking and unliking function

  // useEffect(() => {
  //     db.collection("likes")
  // }, [postID])

  const handleCommentClick = () => {
    //play animation if liked
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
        marginLeft: pixelSizeHorizontal(10),
      }}
    >
      <Pressable
        onPress={handleCommentClick}
        hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <FastImage
          style={{
            height: pixelSizeVertical(17),
            width: pixelSizeHorizontal(21),
            marginBottom: pixelSizeHorizontal(-4),
          }}
          source={commentIcon}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: fontPixel(14),
            fontWeight: "600",
            color: "#DFE5F8",
            marginLeft: pixelSizeHorizontal(5),
          }}
        >
          {commentsCount}
        </Text>
      </Pressable>
    </View>
  );
}
