import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ImageBackground,
} from "react-native";
import club4 from "../assets/club4.png";
import member1 from "../assets/member1.png";
import member2 from "../assets/member2.png";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "./SideMenu";
import Modal from "react-native-modal";
import { Image } from "expo-image";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
const Tab = createMaterialTopTabNavigator();

const { width } = Dimensions.get("window");

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

import ClubsGallery from "./ClubsGallery";
import ClubsEvents from "./ClubsEvents";
import ClubsDetails from "./ClubsDetails";
import ClubsMembers from "./ClubsMembers";

import { ScrollView } from "react-native-gesture-handler";

export default function Test({ navigation }) {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [data, setData] = useState([
    {
      header: "Computer Science Club",
      image: club4,
      navigations: [
        { name: "members" },
        { name: "gallery" },
        { name: "events" },
        { name: "details" },
      ],
    },
  ]);

  const [tab, setTab] = useState("members");

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleJoin = () => {};

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

      <ImageBackground
        source={data[0].image}
        style={styles.imageHeaderContainer}
      >
        <View style={styles.overlayContainer}>
          <Text style={styles.header}>{data[0].header}</Text>
        </View>
      </ImageBackground>

      <ScrollView
        style={StyleSheet.create({
          flex: 1,
          backgroundColor: "#fff",
          marginTop: pixelSizeVertical(10),
          paddingRight: pixelSizeHorizontal(16),
          paddingLeft: pixelSizeHorizontal(16),
        })}
      >
        <Pressable style={styles.loginButton}>
          <Text style={styles.loginButtonText}>login</Text>
        </Pressable>

        <NavigationContainer independent={true}>
          <Tab.Navigator
            style={StyleSheet.create({
              flexGrow: 1,
              backgroundColor: "#000",
            })}
            tabBarOptions={{
              activeTintColor: "#f0f",
              inactiveTintColor: "#555",
              activeBackgroundColor: "#fff",
              inactiveBackgroundColor: "#999",
              showLabel: true,
              labelStyle: { fontSize: 14 },
              showIcon: true,
            }}
            activeColor="#f0edf6"
            inactiveColor="#3e2465"
            barStyle={{ backgroundColor: "#694fad" }}
          >
            <Tab.Screen name="ClubsEvents" component={ClubsEvents} />
            <Tab.Screen name="ClubsGallery" component={ClubsGallery} />
          </Tab.Navigator>
        </NavigationContainer>
      </ScrollView>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingTop: pixelSizeVertical(26),
  },
  imageHeaderContainer: {
    height: pixelSizeVertical(120),
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
    fontSize: fontPixel(34),
    fontWeight: 500,
    color: "#DFE5F8",
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
  },
  loginButton: {
    backgroundColor: "#C4FFF9",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    marginTop: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(24),
    width: "100%",
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#0C111F",
    textAlign: "center",
  },
  onlySpan: {
    flexDirection: "row",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  spanMultiline: {
    flexDirection: "row",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    flexWrap: "wrap",
  },
  navigationLinkActive: {
    color: "#07BEB8",
    fontSize: fontPixel(34),
    marginTop: pixelSizeVertical(6),
    marginRight: pixelSizeHorizontal(26),
    textTransform: "lowercase",
    fontWeight: 700,
    textDecorationLine: "underline",
  },
  navigationLinkInactive: {
    color: "#07BEB8",
    fontSize: fontPixel(34),
    marginTop: pixelSizeVertical(6),
    marginRight: pixelSizeHorizontal(26),
    textTransform: "lowercase",
    fontWeight: 700,
    textDecorationLine: "underline",
    opacity: 0.5,
  },
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
  },
  headerContainer: {
    marginTop: pixelSizeVertical(26),
    marginBottom: pixelSizeVertical(16),
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(40),
  },
});
