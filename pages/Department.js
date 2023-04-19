import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import img1 from "../assets/club1.png";
import img2 from "../assets/club2.png";

import DepartmentAll from "./DepartmentAll";
import DepartmentFeatured from "./DepartmentFeatured";
import DepartmentFiles from "./DepartmentFiles";
import DepartmentSaved from "./DepartmentSaved";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";
import { Image } from "expo-image";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function Department({ navigation }) {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [tab, setTab] = useState("all");

  const [data, setData] = useState([
    {
      department: "Department of Computing and Engineering",
      navigations: [
        { name: "all" },
        { name: "featured" },
        { name: "files" },
        { name: "saved" },
      ],
    },
  ]);

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
    <View style={styles.container}>
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
              {data[0].department}
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
        stickyHeaderIndices={[1]}
        onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
        style={StyleSheet.create({
          marginTop: pixelSizeVertical(10),
        })}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View onLayout={onLayout}>
          <Text style={styles.title}>{data[0].department}</Text>
        </View>

        <View
          style={{
            paddingRight: pixelSizeHorizontal(16),
            paddingLeft: pixelSizeHorizontal(16),
            backgroundColor: "#0C111F",
            paddingBottom: pixelSizeVertical(12),
          }}
        >
          <View style={styles.navigationContainer}>
            {data[0].navigations.length > 0 &&
              data[0].navigations.map((link) => {
                return (
                  <Pressable
                    onPress={() => setTab(link.name)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text
                      style={
                        link.name === tab
                          ? styles.navigationLinkActive
                          : styles.navigationLinkInactive
                      }
                    >
                      {link.name}
                    </Text>
                    <View
                      style={
                        link.name === tab ? styles.navigationBorderActive : null
                      }
                    />
                  </Pressable>
                );
              })}
          </View>
          <View style={styles.navigationBorderInactive} />
        </View>

        {tab === "all" ? (
          <DepartmentAll department={data[0].department} />
        ) : tab === "featured" ? (
          <DepartmentFeatured department={data[0].department} />
        ) : tab === "files" ? (
          <DepartmentFiles department={data[0].department} />
        ) : tab === "saved" ? (
          <DepartmentSaved department={data[0].department} />
        ) : null}
      </ScrollView>

      {/* <FlatList
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => (
          <>
           
          </>
        )}
      /> */}

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
          currentPage={"department"}
          navigation={navigation}
        />
      </Modal>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingTop: pixelSizeVertical(26),
  },
  title: {
    fontSize: fontPixel(28),
    fontWeight: "500",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(30),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
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
    marginRight: pixelSizeHorizontal(16),
    marginLeft: pixelSizeHorizontal(16),
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(30),
  },
  loginButton: {
    backgroundColor: "#C4FFF9",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(30),
    width: "100%",
    borderRadius: 5,
    marginRight: pixelSizeHorizontal(16),
    marginLeft: pixelSizeHorizontal(16),
  },
  loginButtonText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#0C111F",
    textAlign: "center",
  },
  navigationContainer: {
    backgroundColor: "#0C111F",
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
    marginRight: pixelSizeHorizontal(16),
    marginLeft: pixelSizeHorizontal(16),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerContainerHideMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginRight: pixelSizeHorizontal(16),
    marginLeft: pixelSizeHorizontal(16),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
