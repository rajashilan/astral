import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";

import Notification_Icon from "../assets/Notification_Icon";
import Notification_Alert_Icon from "../assets/Notification_Alert_Icon";
import closeIcon from "../assets/close_icon.png";
import { LOGOUT } from "../src/redux/type";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import EmptyView from "./EmptyView";
import IosHeight from "./IosHeight";

const SideMenu = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.credentials);
  const hasNotification = useSelector(
    (state) => state.user.notificationAvailable
  );

  const handleMenuNavigation = (name) => {
    props.callParentScreenFunction();
    if (props.currentPage !== name) {
      const menuItem = name.charAt(0).toUpperCase() + name.slice(1);
      if (name === "general forms") navigation.replace("GeneralForms");
      else navigation.replace(menuItem.trim());
    }
  };

  const handleNavigateToProfile = () => {
    props.callParentScreenFunction();
    if (props.currentPage !== "profile") navigation.replace("Profile");
  };

  const handleNavigateToNotifications = () => {
    props.callParentScreenFunction();
    if (props.currentPage !== "notifications")
      navigation.replace("Notifications");
  };

  const signOutUser = () => {
    auth()
      .signOut()
      .then(() => {
        props.callParentScreenFunction();
        dispatch({ type: LOGOUT });
        navigation.replace("Login");
      })
      .catch(function (error) {
        // An error happened.
        console.error(error);
      });
  };

  return (
    <ScrollView stickyHeaderIndices={[0]} style={styles.safeAreaView}>
      <IosHeight />
      <View style={styles.closeContainer}>
        <Pressable
          onPress={props.callParentScreenFunction}
          style={[
            styles.paddingContainer,
            {
              backgroundColor: "#363BB1",
              paddingTop: pixelSizeVertical(24),
              paddingBottom: pixelSizeVertical(28),
            },
          ]}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <FastImage
            style={styles.closeIcon}
            source={closeIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <Text style={styles.college}>{user.campus}</Text>
      <View style={styles.userDetailsContainer}>
        <Pressable onPress={handleNavigateToProfile}>
          <FastImage
            style={styles.image}
            resizeMode="cover"
            source={{ uri: user.profileImage }}
            progressiveRenderingEnabled={true}
            cache={FastImage.cacheControl.immutable}
            priority={FastImage.priority.normal}
          />
        </Pressable>
        <Pressable
          style={{
            marginRight: pixelSizeHorizontal(10),
            marginLeft: pixelSizeHorizontal(10),
            maxWidth: "60%",
          }}
          onPress={handleNavigateToProfile}
        >
          <Text
            style={{
              color: "#DFE5F8",
              fontSize: fontPixel(22),
              marginBottom: pixelSizeVertical(2),
              fontWeight: "500",
            }}
            numberOfLines={5}
          >
            {user.name}
          </Text>
          <Text
            style={{
              color: "#C6CDE2",
              fontSize: fontPixel(14),
              fontWeight: "400",
            }}
          >
            {user.intake}, {user.department}
          </Text>
        </Pressable>
        <Pressable
          style={{
            marginLeft: "auto",
          }}
          onPress={handleNavigateToNotifications}
        >
          {hasNotification ? (
            <Notification_Alert_Icon />
          ) : (
            <Notification_Icon />
          )}
        </Pressable>
      </View>

      <FlatList
        style={styles.paddingContainer}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={[
          {
            name: "orientation",
          },
          {
            name: "clubs",
          },
          {
            name: "general forms",
          },
          {
            name: "profile",
          },
        ]}
        renderItem={({ item }) => (
          <>
            <Pressable onPress={() => handleMenuNavigation(item.name)}>
              <Text
                style={
                  props.currentPage === item.name
                    ? styles.activeMenuItem
                    : props.currentPage === "clubspages" &&
                        item.name === "clubs"
                      ? styles.activeMenuItem
                      : styles.inactiveMenuItem
                }
              >
                {item.name}
              </Text>
            </Pressable>
            <View style={styles.emptyView} />
          </>
        )}
      />
      <Pressable onPress={signOutUser}>
        <Text style={styles.logout}>logout</Text>
      </Pressable>
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
      <EmptyView backgroundColor={"#363BB1"} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#363BB1",
  },
  paddingContainer: {
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  closeContainer: {
    alignItems: "flex-end",
  },
  closeIcon: {
    backgroundColor: "#363BB1",
    height: pixelSizeVertical(25),
    width: pixelSizeHorizontal(40),
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#363BB1",
  },
  inactiveMenuItem: {
    fontSize: fontPixel(48),
    fontWeight: 400,
    color: "#07BEB8",
  },
  activeMenuItem: {
    fontSize: fontPixel(48),
    fontWeight: 700,
    color: "#C4FFF9",
  },
  logout: {
    fontSize: fontPixel(32),
    fontWeight: 400,
    color: "#8C91FB",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  notificationIcon: {
    height: pixelSizeVertical(24),
    width: pixelSizeHorizontal(28),
  },
  image: {
    width: widthPixel(60),
    height: heightPixel(60),
    marginTop: "auto",
    marginBottom: "auto",
    borderRadius: 50,
  },
  college: {
    color: "#DFE5F8",
    fontSize: fontPixel(18),
    marginTop: pixelSizeVertical(8),
    marginBottom: pixelSizeVertical(24),
    fontWeight: "400",
    textAlign: "center",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  userDetailsContainer: {
    flexDirection: "row",
    marginBottom: pixelSizeVertical(24),
    backgroundColor: "#242997",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(12),
    paddingBottom: pixelSizeVertical(12),
  },
  userDetailsContainerBorder: {
    flexDirection: "row",
    marginBottom: pixelSizeVertical(24),
    backgroundColor: "#242997",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(12),
    paddingBottom: pixelSizeVertical(12),
    borderWidth: widthPixel(4),
    borderColor: "#C4FFF9",
  },
});

export default SideMenu;
