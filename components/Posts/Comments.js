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
import Modal from "react-native-modal";
import CommentsModal from "../CommentsModal";

const db = firestore();

export default function Comments(props) {
  const { postID, commentsCount, context } = props;

  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const toggleCommentsModal = () => {
    setShowCommentsModal(!showCommentsModal);
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
        onPress={toggleCommentsModal}
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

      <Modal
        isVisible={showCommentsModal}
        onBackdropPress={toggleCommentsModal} // Android back press
        onSwipeComplete={toggleCommentsModal} // Swipe to discard
        animationIn="slideInUp" // Has others, we want slide in from the left
        animationOut="slideOutDown" // When discarding the drawer
        useNativeDriver // Faster animation
        swipeDirection="down"
        hideModalContentWhileAnimating // Better performance, try with/without"
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={{
          margin: 0,
          marginTop: pixelSizeVertical(200),
        }} // Needs to contain the width, 75% of screen width in our case
      >
        <CommentsModal
          postID={postID}
          context={context}
          callParentScreenFunction={toggleCommentsModal}
        />
      </Modal>
    </View>
  );
}
