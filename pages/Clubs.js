import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

import Header from "../components/Header";
import IosHeight from "../components/IosHeight";

import club1 from "../assets/club1.png";
import club2 from "../assets/club2.png";
import club3 from "../assets/club3.png";
import club4 from "../assets/club4.png";
import club5 from "../assets/club5.png";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const { width } = Dimensions.get("window");

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

export default function Clubs({ navigation }) {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [tab, setTab] = useState("all clubs");

  const [all, setAll] = useState([
    {
      image: club1,
      title: "Anime Club",
    },
    {
      image: club2,
      title: "Guitar Club",
    },
    {
      image: club3,
      title: "Engineering Club",
    },
    {
      image: club4,
      title: "Computer Science Club",
    },
    {
      image: club5,
      title: "Charitable Cause for Animals Club",
    },
  ]);

  const [yours, setYours] = useState([
    {
      image: club4,
      title: "Computer Science Club",
    },
    {
      image: club5,
      title: "Charitable Cause for Animals Club",
    },
  ]);

  const handlePageItemPress = () => {
    navigation.navigate("ClubsPages");
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

  return (
    <>
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
                {tab}
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

        <ScrollView
          scrollEventThrottle={16}
          onScroll={(event) =>
            setScrollHeight(event.nativeEvent.contentOffset.y)
          }
          showsVerticalScrollIndicator={false}
        >
          <View
            onLayout={onLayout}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <Pressable onPress={() => setTab("all clubs")}>
              <Text
                style={
                  tab === "all clubs" ? styles.tabActive : styles.tabInactive
                }
              >
                all clubs
              </Text>
            </Pressable>
            <Pressable onPress={() => setTab("yours")}>
              <Text
                style={tab === "yours" ? styles.tabActive : styles.tabInactive}
              >
                yours
              </Text>
            </Pressable>
          </View>

          <FlatList
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={tab === "all clubs" ? all : yours}
            renderItem={({ item }) => (
              <View style={{ marginBottom: pixelSizeHorizontal(30) }}>
                <Pressable onPress={handlePageItemPress}>
                  <Image
                    style={styles.image}
                    source={item.image}
                    contentFit="cover"
                    transition={1000}
                  />
                  <Text style={styles.pageItems}>{item.title}</Text>
                </Pressable>
              </View>
            )}
          />
          {tab === "yours" && yours.length === 0 ? (
            <View style={styles.joinClubContainer}>
              <View style={styles.joinClubInnerContainer}>
                <Pressable>
                  <Text style={styles.joinClubButton}>Find your club,</Text>
                </Pressable>
                <Text style={styles.joinClubText}>
                  make friends, and share your passion!
                </Text>
              </View>

              <View style={styles.joinClubInnerContainer}>
                <Text style={styles.joinClubText}>
                  Can't find the perfect club?
                </Text>
                <Pressable onPress={() => navigation.navigate("CreateAClub")}>
                  <Text style={styles.joinClubButton}>Create your own!</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => navigation.navigate("CreateAClub")}
              style={{ alignItems: "center" }}
            >
              <Text style={styles.joinClubSmallButton}>
                Create your own club
              </Text>
            </Pressable>
          )}
          <View style={styles.emptyView}></View>
        </ScrollView>
      </View>
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
          currentPage={"clubs"}
          navigation={navigation}
        />
      </Modal>
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  header: {
    fontSize: fontPixel(42),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  image: {
    width: "100%",
    height: heightPixel(150),
    marginBottom: pixelSizeVertical(10),
    borderRadius: 5,
  },
  pageItems: {
    fontSize: fontPixel(28),
    fontWeight: "500",
    color: "#C4FFF9",
    lineHeight: 36,
    marginLeft: pixelSizeVertical(2),
    marginRight: pixelSizeVertical(2),
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(60),
    backgroundColor: "#0C111F",
  },
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
  },
  headerContainer: {
    marginTop: pixelSizeVertical(20),
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: pixelSizeVertical(8),
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
  tabActive: {
    fontSize: fontPixel(34),
    fontWeight: "500",
    color: "#C4FFF9",
    marginBottom: pixelSizeVertical(18),
    marginRight: pixelSizeHorizontal(32),
  },
  tabInactive: {
    fontSize: fontPixel(34),
    fontWeight: "500",
    color: "#C4FFF9",
    marginBottom: pixelSizeVertical(18),
    opacity: 0.5,
    marginRight: pixelSizeHorizontal(32),
  },
  joinClubContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: pixelSizeVertical(24),
  },
  joinClubInnerContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: pixelSizeVertical(24),
  },
  joinClubButton: {
    fontSize: fontPixel(36),
    fontWeight: "500",
    color: "#07BEB8",
    textDecorationLine: "underline",
  },
  joinClubSmallButton: {
    fontSize: fontPixel(20),
    fontWeight: "500",
    color: "#07BEB8",
    textDecorationLine: "underline",
    marginTop: pixelSizeVertical(42),
  },
  joinClubText: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
  },
});
