import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeInDown,
  FadeOutUp,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import hamburgerIcon from "../assets/hamburger_icon.png";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import { getEventPosts } from "../src/redux/actions/dataActions";
import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";

import Loader from "../components/Loader";
import PostsAdapter from "../components/Posts/PostsAdapter";
import EmptyView from "../components/EmptyView";
import Header from "../components/Header";

const { width, height } = Dimensions.get("window");

const context = "club";

export default function ClubsEvents({ navigation }) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data.clubData.club);
  const posts = useSelector((state) => state.data.clubData.event);
  const loading = useSelector((state) => state.data.loading);
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

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

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    dispatch(getEventPosts(data.clubID));
  }, []);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const UI = loading ? (
    <Loader />
  ) : (
    <Animated.ScrollView
      showsHorizontalScrollIndicator={false}
      stickyHeaderIndices={[2]}
      entering={FadeInDown.duration(300)}
      onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
    >
      <Animated.View
        entering={FadeInUp.duration(100)}
        exiting={FadeOutUp.duration(70)}
        style={{ paddingHorizontal: pixelSizeHorizontal(16) }}
      >
        <View onLayout={onLayout}>
          <Header header="club events" />
        </View>
      </Animated.View>

      <FlatList
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        data={posts}
        renderItem={({ item }) => (
          <PostsAdapter item={item} context={context} />
        )}
      />
      <EmptyView />
    </Animated.ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
    >
      <IosHeight />
      <View style={styles.headerContainerShowMiniHeader}>
        <Pressable
          onPress={handleNavigateBack}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Text style={styles.backButton}>back</Text>
        </Pressable>
        {showMiniHeader ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              club events
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
      {UI}

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
          currentPage="clubspages"
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
  },
  imageHeaderContainer: {
    height: pixelSizeVertical(180),
    width: "100%",
  },
  overlayContainer: {
    justifyContent: "center",
    height: pixelSizeVertical(120),
    width: "100%",
    backgroundColor: "rgba(12, 17, 31, 0.7)",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
  },
  header: {
    fontSize: fontPixel(24),
    fontWeight: "600",
    color: "#DFE5F8",
  },
  navigationContainer: {
    marginTop: pixelSizeVertical(16),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navigationLinkActive: {
    color: "#DFE5F8",
    fontSize: fontPixel(16),
    fontWeight: "500",
    width: width / 4,
    textAlign: "center",
  },
  navigationLinkInactive: {
    color: "#DFE5F8",
    fontSize: fontPixel(16),
    fontWeight: "400",
    opacity: 0.5,
  },
  navigationBorderActive: {
    borderBottomColor: "#DFE5F8",
    borderBottomWidth: 1,
    width: "100%",
    marginTop: pixelSizeVertical(10),
  },
  navigationBorderInactive: {
    borderBottomColor: "#DFE5F8",
    borderBottomWidth: 1,
    width: "100%",
    opacity: 0.5,
    marginTop: pixelSizeVertical(-1),
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
  },
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
  },
  createAPostMenuStyle: {
    margin: 0,
    marginTop: pixelSizeVertical(100),
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(30),
  },
  backButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#C4FFF9",
    marginTop: pixelSizeVertical(2),
  },
  headerMini: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    maxWidth: width - 180,
    marginLeft: pixelSizeHorizontal(-10),
  },
  headerMiniInvisible: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginRight: pixelSizeHorizontal(16),
    maxWidth: "80%",
    opacity: 0,
  },
  headerContainerShowMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
