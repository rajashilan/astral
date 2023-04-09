import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

import club1 from "../../assets/club1.png";
import club2 from "../../assets/club2.png";
import club3 from "../../assets/club3.png";
import club4 from "../../assets/club4.png";
import club5 from "../../assets/club5.png";

import hamburgerIcon from "../../assets/hamburger_icon.png";

import SideMenu from "./SideMenu";
import Modal from "react-native-modal";

const { width } = Dimensions.get("window");

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../../utils/responsive-font";

export default function Clubs({ navigation }) {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [data, setData] = useState([
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

  const handlePageItemPress = () => {
    navigation.navigate("ClubsPages");
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  return (
    <>
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
        <Text style={styles.header}>clubs</Text>
        <FlatList
          style={styles.list}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={data}
          renderItem={({ item }) => (
            <>
              <Pressable onPress={handlePageItemPress}>
                <Image
                  style={styles.image}
                  source={item.image}
                  contentFit="cover"
                  transition={1000}
                />
                <Text style={styles.pageItems}>{item.title}</Text>
              </Pressable>
              <View style={styles.emptyView}></View>
            </>
          )}
        />
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
      <StatusBar style="light" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(26),
  },
  header: {
    fontSize: fontPixel(56),
    fontWeight: 500,
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(4),
  },
  pageItems: {
    fontSize: fontPixel(34),
    fontWeight: 500,
    color: "#07BEB8",
    textDecorationLine: "underline",
  },
  image: {
    width: "100%",
    height: heightPixel(150),
    marginBottom: pixelSizeVertical(10),
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(30),
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
  navDrawerContainer: {
    height: pixelSizeVertical(30),
    width: pixelSizeHorizontal(40),
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
