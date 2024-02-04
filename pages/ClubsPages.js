import * as Crypto from "expo-crypto";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ImageBackground,
} from "react-native";
import { Wave } from "react-native-animated-spinkit";
import Modal from "react-native-modal";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeOutUp,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import ClubsDetails from "./ClubsDetails";
import ClubsEvents from "./ClubsEvents";
import ClubsGallery from "./ClubsGallery";
import ClubsMembers from "./ClubsMembers";
import hamburgerIcon from "../assets/hamburger_icon.png";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  createNotification,
  getAClub,
  joinClub,
} from "../src/redux/actions/dataActions";
import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { RESET_CLUB_DATA } from "../src/redux/type";

const Tab = createMaterialTopTabNavigator();

const { width } = Dimensions.get("window");

export default function ClubsPages({ navigation, route }) {
  const { clubID } = route.params;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.credentials);
  const data = useSelector((state) => state.data.clubData.club);
  const loading = useSelector((state) => state.data.loading);
  const UIloading = useSelector((state) => state.UI.loading);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const [hasRequested, setHasRequested] = useState(false);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const [showAgreementPopUp, setShowAgreementPopUp] = useState(false);

  const [show, setShow] = useState(true);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    dispatch(getAClub(clubID, user.userId));
    return () => {
      dispatch({ type: RESET_CLUB_DATA });
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(data)) {
      const temp = [...data.membersRequests];
      const index = temp.findIndex((member) => member.userID === user.userId);
      if (index !== -1)
        if (temp[index].approval !== "rejected") setHasRequested(true);
    }
  }, [data]);

  //show edit buttons based on the user data logic
  //if filter returns null, show join button, dont show you button or add button
  //the members data can then be passed to clubsMembers as props
  //pass down current member data to all components as prop
  //same goes for clubsDetails
  //gallery and events get their data separately

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleYou = () => {
    navigation.navigate("ClubsYou");
  };

  const handleEditClub = () => {
    navigation.navigate("EditClub");
  };

  const handleJoin = () => {
    setShowAgreementPopUp(!showAgreementPopUp);
    const memberID = Crypto.randomUUID();
    const createdAt = new Date();

    const joinData = {
      name: user.name,
      phone: user.phone_number,
      email: user.email,
      intake: user.intake,
      department: user.department,
      memberID,
      userID: user.userId,
      role: "member",
      createdAt,
      profileImage: user.profileImage,
      bio: "",
    };

    const clubsData = {
      clubID: data.clubID,
      userID: user.userId,
      name: data.name,
      memberID,
      role: "member",
      createdAt,
      approval: "pending",
    };

    const notification = {
      preText: "New member request for",
      postText: "",
      sourceID: data.clubID,
      sourceName: data.name,
      sourceImage: data.image,
      sourceDestination: "ClubsPages",
      defaultText: "",
      read: false,
      userID: "",
      createdAt: new Date().toISOString(),
      notificationID: "",
    };

    const userIDs = [data.roles.president.userID];

    dispatch(joinClub(joinData, clubsData, data.clubID));
    dispatch(createNotification(notification, userIDs));
  };

  //handle scroll for components
  const handleScroll = (scrollHeight) => {
    let hideHeader = false;

    if (scrollHeight > 120 && !hideHeader) hideHeader = true;
    else if (scrollHeight < 130 && hideHeader) hideHeader = false;
    setShow(!hideHeader);
  };

  const UI = UIloading ? (
    <View style={{ marginTop: pixelSizeVertical(60) }}>
      <Wave
        size={240}
        color="#495986"
        style={{ alignSelf: "center", marginBottom: pixelSizeVertical(260) }}
      />
    </View>
  ) : (
    <>
      {show && (
        <Animated.View
          entering={FadeInUp.duration(100)}
          exiting={FadeOutUp.duration(70)}
        >
          {data && data.image && (
            <View>
              <ImageBackground
                source={{ uri: data.image }}
                style={styles.imageHeaderContainer}
              >
                <View style={styles.overlayContainer}>
                  <Text style={styles.header}>{data.name}</Text>
                </View>
              </ImageBackground>
            </View>
          )}
        </Animated.View>
      )}

      <View
        style={{
          paddingRight: pixelSizeHorizontal(16),
          paddingLeft: pixelSizeHorizontal(16),
        }}
      >
        {isEmpty(currentMember) && !hasRequested && (
          <PrimaryButton
            onPress={() => setShowAgreementPopUp(!showAgreementPopUp)}
            text="join"
            loading={loading}
            buttonStyle={{ marginBottom: pixelSizeVertical(4) }}
          />
        )}
      </View>

      <Tab.Navigator
        screenOptions={{
          lazy: true,
          lazyPreloadDistance: 1,
          tabBarAllowFontScaling: true,
          tabBarActiveTintColor: "#DFE5F8",
          tabBarIndicator: null,
          lazyPlaceholder: () => (
            <View
              style={{
                flex: 1,
                backgroundColor: "#232F52",
              }}
            ></View>
          ),
          swipeEnabled: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            marginBottom: -8,
          },
          style: {
            elevation: 0, // for Android
            shadowOffset: {
              width: 0,
              height: 0, // for iOS
            },
          },
          tabBarIndicatorStyle: {
            width: 0,
            height: 0,
            elevation: 0,
          },
        }}
      >
        <Tab.Screen name="members">
          {() => <ClubsMembers onScroll={handleScroll} />}
        </Tab.Screen>
        <Tab.Screen name="gallery">
          {() => (
            <ClubsGallery navigation={navigation} onScroll={handleScroll} />
          )}
        </Tab.Screen>
        <Tab.Screen name="events">
          {() => (
            <ClubsEvents navigation={navigation} onScroll={handleScroll} />
          )}
        </Tab.Screen>
        <Tab.Screen name="details">
          {() => <ClubsDetails onScroll={handleScroll} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );

  return (
    <View style={styles.container}>
      <IosHeight />
      <View style={styles.headerContainerShowMiniHeader}>
        <Pressable
          onPress={handleNavigateBack}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Text style={styles.backButton}>back</Text>
        </Pressable>
        {isEmpty(currentMember) && !show && !UIloading ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              {data && data.name}
            </Text>
          </Animated.View>
        ) : (
          <Text style={styles.headerMiniInvisible}>title</Text>
        )}
        {!isEmpty(currentMember) && !UIloading && (
          <Pressable onPress={handleYou} style={styles.youButton}>
            <Text style={styles.youText}>you</Text>
          </Pressable>
        )}
        {!isEmpty(currentMember) &&
          currentMember.role === "president" &&
          !UIloading && (
            <Pressable onPress={handleEditClub} style={styles.youButtonNoAuto}>
              <Text style={styles.youText}>club</Text>
            </Pressable>
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

      <Modal
        isVisible={showAgreementPopUp}
        onBackdropPress={() => setShowAgreementPopUp(!showAgreementPopUp)} // Android back press
        animationIn="bounceIn" // Has others, we want slide in from the left
        animationOut="bounceOut" // When discarding the drawer
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.withdrawPopupStyle} // Needs to contain the width, 75% of screen width in our case
      >
        <View style={styles.withdrawMenu}>
          <Text
            style={{
              fontSize: fontPixel(20),
              fontWeight: "400",
              color: "#DFE5F8",
              marginBottom: pixelSizeVertical(12),
              textAlign: "center",
            }}
          >
            By tapping confirm, you agree that your details can be shared to the
            club upon joining.
          </Text>
          <PrimaryButton
            loading={loading}
            onPress={handleJoin}
            text="confirm"
          />
          {!loading && (
            <Pressable
              onPress={() => setShowAgreementPopUp(!showAgreementPopUp)}
            >
              <Text style={styles.withdrawButton}>cancel</Text>
            </Pressable>
          )}
        </View>
      </Modal>
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
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
    fontWeight: "500",
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
  youButtonNoAuto: {
    marginRight: pixelSizeHorizontal(18),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(1),
    paddingBottom: pixelSizeVertical(6),
    backgroundColor: "#232F52",
    borderRadius: 5,
  },
  youButton: {
    marginLeft: "auto",
    marginRight: pixelSizeHorizontal(12),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(1),
    paddingBottom: pixelSizeVertical(6),
    backgroundColor: "#232F52",
    borderRadius: 5,
  },
  youText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
  },
  withdrawMenu: {
    height: "auto",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    backgroundColor: "#131A2E",
    display: "flex",
    borderRadius: 5,
  },
  withdrawButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
  },
});
