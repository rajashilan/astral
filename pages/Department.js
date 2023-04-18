import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  FlatList,
  ScrollView,
  Animated,
} from "react-native";
import React, { useState } from "react";
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

const { width } = Dimensions.get("window");
const fontSize = 28;
const fontWeight = "500";

export default function Department({ navigation }) {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

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
      <ScrollView
        style={StyleSheet.create({
          marginTop: pixelSizeVertical(10),
        })}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Text style={styles.title}>{data[0].department}</Text>
        <View style={styles.navigationContainer}>
          {data[0].navigations.length > 0 &&
            data[0].navigations.map((link) => {
              return (
                <Pressable onPress={() => setTab(link.name)}>
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
        <View
          style={{
            marginRight: pixelSizeHorizontal(16),
            marginLeft: pixelSizeHorizontal(16),
          }}
        >
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
    fontSize: fontPixel(fontSize),
    fontWeight: fontWeight,
    color: "#DFE5F8",
    marginTop: pixelSizeVertical(16),
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
    marginTop: pixelSizeVertical(26),
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: pixelSizeHorizontal(16),
    marginLeft: pixelSizeHorizontal(16),
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(40),
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
    marginRight: pixelSizeHorizontal(16),
    marginLeft: pixelSizeHorizontal(16),
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
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  navigationBorderInactive: {
    borderBottomColor: "#DFE5F8",
    borderBottomWidth: 1,
    width: "100%",
    opacity: 0.5,
    marginTop: pixelSizeVertical(-1),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
});
