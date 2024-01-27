import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  TextInput,
} from "react-native";
import { Wave } from "react-native-animated-spinkit";
import { ScrollView } from "react-native-gesture-handler";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { Video } from "expo-av";
import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import { getOrientation } from "../src/redux/actions/dataActions";
import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import EmptyView from "../components/EmptyView";

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
  const [search, setSearch] = useState("");

  console.log(overview);

  useEffect(() => {
    if (user.authenticated) dispatch(getOrientation(state.campus.campusID));
  }, [user.authenticated]);

  useEffect(() => {
    setOverview({ ...orientation.overview });
  }, [orientation.overview]);

  useEffect(() => {
    return () => {
      setSearch("");
    };
  }, []);

  const handlePageItemPress = (orientationPageID) => {
    navigation.navigate("OrientationPages", {
      orientationPageID,
    });
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

  const UI = loading ? (
    <View style={{ marginTop: pixelSizeVertical(60) }}>
      <Wave
        size={240}
        color="#495986"
        style={{ alignSelf: "center", marginBottom: pixelSizeVertical(260) }}
      />
    </View>
  ) : (
    <ScrollView
      scrollEventThrottle={16}
      stickyHeaderIndices={[2]}
      onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      showsVerticalScrollIndicator={false}
    >
      <View onLayout={onLayout}>
        <Header header="orientation" />
      </View>

      <Text style={styles.title}>{overview.title}</Text>

      {overview.videos &&
        overview.videos.map((video) => {
          let videoID = video.url.split("/");
          videoID = videoID[videoID.length - 2];
          console.log(videoID);
          return (
            <Video
              source={{
                uri: `https://drive.google.com/uc?export=download&id=${videoID}`,
              }}
              style={styles.video}
              useNativeControls
              resizeMode="contain"
            />
          );
        })}

      <View
        style={{
          backgroundColor: "#0C111F",
        }}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Search orientation pages"
          placeholderTextColor="#DBDBDB"
          value={search}
          onChangeText={(newSearch) => setSearch(newSearch)}
        />
      </View>

      <FlatList
        style={styles.list}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        data={
          overview.pages &&
          overview.pages.filter((page) =>
            page.title.toLowerCase().includes(search.toLowerCase())
          )
        }
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
      <EmptyView />
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
          currentPage="orientation"
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
    // marginTop: pixelSizeVertical(18),
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
    height: 180,
    backgroundColor: "#1A2238",
    marginBottom: pixelSizeVertical(16),
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
  textInput: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(18),
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    width: "100%",
    borderRadius: 5,
  },
});
