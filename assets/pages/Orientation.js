import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../../utils/responsive-font";
import { StatusBar } from "expo-status-bar";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";

import hamburgerIcon from "../../assets/hamburger_icon.png";
import SideMenu from "./SideMenu";
import Modal from "react-native-modal";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

export default function Orientation({ navigation }) {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [pages, setPages] = useState([
    { page: "first day", id: 1 },
    { page: "second day", id: 2 },
    { page: "campus tour", id: 3 },
  ]);

  const handlePageItemPress = () => {
    navigation.navigate("OrientationPages");
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Pressable onPress={toggleSideMenu}>
          <Image
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            contentFit="contain"
          />
        </Pressable>
      </View>

      <Text style={styles.header}>orientation</Text>
      <VideoPlayer
        style={styles.video}
        videoProps={{
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
        }}
      />

      <Text style={styles.title}>
        welcome to inti international college penang!
      </Text>

      <FlatList
        style={styles.list}
        keyExtractor={(item, index) => index.toString()}
        data={pages}
        renderItem={({ item }) => (
          <Pressable onPress={handlePageItemPress}>
            <Text style={styles.pageItems}>{item.page}</Text>
          </Pressable>
        )}
      />

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

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(26),
    paddingBottom: pixelSizeVertical(16),
  },
  header: {
    fontSize: fontPixel(56),
    fontWeight: 500,
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(28),
  },
  title: {
    fontSize: fontPixel(26),
    fontWeight: 500,
    color: "#F5F5F5",
    marginTop: pixelSizeVertical(18),
    marginBottom: pixelSizeVertical(30),
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pageItems: {
    fontSize: fontPixel(34),
    fontWeight: 500,
    color: "#07BEB8",
    marginBottom: pixelSizeVertical(20),
    textDecorationLine: "underline",
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
  headerContainer: {
    marginTop: pixelSizeVertical(26),
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(40),
  },
});
