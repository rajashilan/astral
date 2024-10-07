import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import firestore from "@react-native-firebase/firestore";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import IosHeight from "../components/IosHeight";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";
import CustomTextInput from "../components/CustomTextInput";
import Modal from "react-native-modal";
import EmptyView from "../components/EmptyView";
import Header from "../components/Header";
import FastImage from "react-native-fast-image";
import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Animated, { FadeIn, FadeOut, FadeInDown } from "react-native-reanimated";
import { SET_UI_LOADING, STOP_UI_LOADING } from "../src/redux/type";
import { feedbackImagesTexts } from "../data/feedbackImagesTexts";

import feedbackImage from "../assets/feedback.png";

import cat1 from "../assets/cat1.jpg";
import cat2 from "../assets/cat2.jpg";
import cat3 from "../assets/cat3.jpg";
import cat4 from "../assets/cat4.jpg";
import cat5 from "../assets/cat5.jpg";
import cat6 from "../assets/cat6.jpg";
import cat7 from "../assets/cat7.jpg";
import cat8 from "../assets/cat8.jpg";
import cat9 from "../assets/cat9.jpg";
import cat10 from "../assets/cat10.jpg";
import cat11 from "../assets/cat11.jpg";

const { width } = Dimensions.get("window");

const db = firestore();

export default function Feedback({ navigation, route }) {
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState({
    feedback: undefined,
  });
  const campusID = useSelector((state) => state.data.campus.campusID);
  const userID = useSelector((state) => state.user.credentials.userId);
  const loading = useSelector((state) => state.UI.loading);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [randomNumber, setRandomNumber] = useState(0);

  const [catImages] = useState({
    1: cat1,
    2: cat2,
    3: cat3,
    4: cat4,
    5: cat5,
    6: cat6,
    7: cat7,
    8: cat8,
    9: cat9,
    10: cat10,
    11: cat11,
  });

  const handleSubmit = async () => {
    const errors = { ...errors };

    if (!feedback.trim()) errors.feedback = "Please enter your feedback";

    if (!errors.feedback) {
      dispatch({ type: SET_UI_LOADING });

      const data = {
        userID,
        campusID,
        feedback,
      };

      try {
        await db.collection("feedback").add(data);
        setFeedback("");
        setFeedbackSubmitted(true);
        generateRandomNumber();
      } catch (error) {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
        });
      } finally {
        dispatch({ type: STOP_UI_LOADING });
      }
    }

    setErrors(errors);
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  useEffect(() => {
    //if scroll height is more than header height and the header is not shown, show
    if (scrollHeight > headerHeight && !showMiniHeader) setShowMiniHeader(true);
    else if (scrollHeight < headerHeight && showMiniHeader)
      setShowMiniHeader(false);
  }, [scrollHeight, showMiniHeader]);

  const generateRandomNumber = () => {
    setRandomNumber(Math.floor(Math.random() * 11) + 1);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
      style={styles.container}
    >
      <IosHeight />
      <View
        style={
          showMiniHeader
            ? styles.headerContainerShowMiniHeader
            : styles.headerContainerHideMiniHeader
        }
      >
        {showMiniHeader ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              feedback
            </Text>
          </Animated.View>
        ) : (
          <Text style={styles.headerMiniInvisible}>title</Text>
        )}
        <Pressable
          onPress={toggleSideMenu}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <FastImage
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <Animated.ScrollView
        entering={FadeInDown.duration(300)}
        scrollEventThrottle={16}
        onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
        showsVerticalScrollIndicator={false}
      >
        <View onLayout={onLayout}>
          <Header header="feedback" style={{ opacity: 0, marginBottom: 0 }} />
        </View>
        <Text style={styles.title}>Submit your feedback</Text>
        <FastImage
          style={styles.displayImage}
          transition={1000}
          resizeMode="contain"
          source={!feedbackSubmitted ? feedbackImage : catImages[randomNumber]}
          progressiveRenderingEnabled={true}
          cache={FastImage.cacheControl.immutable}
          priority={FastImage.priority.normal}
        />

        <Text style={styles.content}>
          {!feedbackSubmitted
            ? `Think a certain change would be better? Share your thoughts with us! It helps us make this app even better for you.`
            : feedbackImagesTexts[randomNumber]}
        </Text>
        <Text style={styles.content}></Text>
        <CustomTextInput
          placeholder="enter your feedback here..."
          value={feedback}
          multiline={true}
          numberOfLines={4}
          editable={!loading}
          onChangeText={(feedback) => setFeedback(feedback)}
        />
        {errors.feedback ? (
          <Text style={styles.error}>{errors.feedback}</Text>
        ) : null}

        <PrimaryButton loading={loading} onPress={handleSubmit} text="submit" />
        {errors.general ? (
          <Text style={styles.errorUnderButton}>{errors.general}</Text>
        ) : null}
        {!feedbackSubmitted && !feedback && (
          <Text style={styles.littleText}>
            Psst, you get a surprise message after :D
          </Text>
        )}

        {feedback && (
          <Pressable
            onPress={() => {
              setFeedback("");
            }}
          >
            <Text style={styles.tertiaryButton}>cancel</Text>
          </Pressable>
        )}
        <EmptyView />
      </Animated.ScrollView>

      <Modal
        isVisible={isSideMenuVisible}
        onBackdropPress={toggleSideMenu} // Android back press
        onSwipeComplete={toggleSideMenu} // Swipe to discard
        animationIn="slideInRight" // Has others, we want slide in from the left
        animationOut="slideOutRight" // When discarding the drawer
        swipeDirection="left" // Discard the drawer with swipe to left
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.sideMenuStyle} // Needs to contain the width, 75% of screen width in our case
      >
        <SideMenu
          callParentScreenFunction={toggleSideMenu}
          currentPage="feedback"
          navigation={navigation}
        />
      </Modal>
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  text: {
    color: "#fff",
  },
  error: {
    marginTop: pixelSizeVertical(8),
    marginBottom: pixelSizeVertical(8),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#ed3444",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  errorUnderButton: {
    marginTop: pixelSizeVertical(-12),
    marginBottom: pixelSizeVertical(16),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#ed3444",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    textAlign: "center",
  },
  tertiaryButton: {
    color: "#A7AFC7",
    fontSize: fontPixel(18),
    textTransform: "lowercase",
    fontWeight: "400",
    textAlign: "center",
  },
  title: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    marginTop: pixelSizeVertical(-10),
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(6),
    textAlign: "center",
  },
  content: {
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    textAlign: "center",
  },
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
  },
  headerContainerShowMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContainerHideMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(30),
  },
  headerMini: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginRight: pixelSizeHorizontal(16),
    maxWidth: width - 100,
  },
  headerMiniInvisible: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginRight: pixelSizeHorizontal(16),
    maxWidth: "80%",
    opacity: 0,
  },
  displayImage: {
    alignSelf: "center",
    width: width - 32,
    height: heightPixel(240),
    marginBottom: pixelSizeVertical(24),
    marginTop: pixelSizeVertical(24),
  },
  littleText: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#A7AFC7",
    textAlign: "center",
  },
});
