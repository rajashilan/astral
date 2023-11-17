import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { StatusBar } from "expo-status-bar";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";

import { Bounce } from "react-native-animated-spinkit";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";
import { Image } from "expo-image";

import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useDispatch, useSelector } from "react-redux";
import { getOrientation } from "../src/redux/actions/dataActions";

const { width } = Dimensions.get("window");

export default function Orientation({ navigation }) {
  const orientation = useSelector((state) => state.data.orientation);
  const state = useSelector((state) => state.data);
  const user = useSelector((state) => state.user);
  const loading = useSelector((state) => state.data.loading);
  const dispatch = useDispatch();

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [overview, setOverview] = useState({});

  useEffect(() => {
    if (user.authenticated) dispatch(getOrientation(state.campus.campusID));
  }, [user.authenticated]);

  useEffect(() => {
    setOverview({ ...orientation.overview });
  }, [orientation.overview]);

  const handlePageItemPress = (orientationPageID) => {
    navigation.navigate("OrientationPages", {
      orientationPageID,
    });
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const onLayout = (event) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  useEffect(() => {
    //if scroll height is more than header height and the header is not shown, show
    if (scrollHeight > headerHeight && !showMiniHeader) setShowMiniHeader(true);
    else if (scrollHeight < headerHeight && showMiniHeader)
      setShowMiniHeader(false);
  }, [scrollHeight, showMiniHeader]);

  let UI = loading ? (
    <View style={{ marginTop: pixelSizeVertical(60) }}>
      <Bounce size={240} color="#495986" style={{ alignSelf: "center" }} />
    </View>
  ) : (
    <ScrollView
      scrollEventThrottle={16}
      onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      showsVerticalScrollIndicator={false}
    >
      <View onLayout={onLayout}>
        <Header header={"orientation"} />
      </View>
      {overview.video && (
        <VideoPlayer
          style={styles.video}
          videoProps={{
            resizeMode: ResizeMode.CONTAIN,
            source: {
              uri: overview.videos[0],
            },
          }}
        />
      )}

      <Text style={styles.title}>{overview.title}</Text>

      <FlatList
        style={styles.list}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        data={overview.pages}
        renderItem={({ item }) => (
          <>
            <Pressable
              onPress={() => {
                handlePageItemPress(item.orientationPageID);
              }}
            >
              <Text style={styles.pageItems}>{item.title}</Text>
            </Pressable>
            <View style={styles.divider} />
          </>
        )}
      />
    </ScrollView>
  );

  return (
    <View style={styles.container}>
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
              orientation
            </Text>
          </Animated.View>
        ) : (
          <Text style={styles.headerMiniInvisible}>title</Text>
        )}
        <Pressable
          onPress={toggleSideMenu}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Image
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            contentFit="contain"
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
          currentPage={"orientation"}
          navigation={navigation}
        />
      </Modal>
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingBottom: pixelSizeVertical(16),
  },
  title: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginTop: pixelSizeVertical(18),
    marginBottom: pixelSizeVertical(26),
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
  video: {
    alignSelf: "center",
    width: width - 32,
    height: 200,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pageItems: {
    fontSize: fontPixel(28),
    fontWeight: "500",
    color: "#C4FFF9",
    marginBottom: pixelSizeVertical(12),
  },
  divider: {
    borderBottomColor: "#283350",
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: pixelSizeVertical(12),
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
});
