import React, { useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
  PixelRatio,
} from "react-native";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../src/firebase/config";
import closeIcon from "../assets/close_icon.png";
import notificationIcon from "../assets/notification_icon.png";
import { LOGOUT } from "../src/redux/type";

import Notification_Icon from "../assets/Notification_Icon";

const SideMenu = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.credentials);

  const handleMenuNavigation = (name) => {
    props.callParentScreenFunction();
    const menuItem = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === "staff list") navigation.replace("Stafflist");
    else if (name === "general forms") navigation.replace("GeneralForms");
    else navigation.replace(menuItem.trim());
  };

  const handleNavigateToProfile = () => {
    props.callParentScreenFunction();
    navigation.replace("Profile");
  };

  const handleNavigateToNotifications = () => {
    props.callParentScreenFunction();
    navigation.replace("Notifications");
  };

  const signOutUser = () => {
    firebase
      .auth()
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
    <SafeAreaView style={styles.safeAreaView}>
      <View>
        <View style={styles.closeContainer}>
          <Pressable
            onPress={props.callParentScreenFunction}
            style={styles.paddingContainer}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Image
              style={styles.closeIcon}
              source={closeIcon}
              contentFit="contain"
            />
          </Pressable>
        </View>

        <Text style={styles.college}>{user.campus}</Text>
        <View
          style={
            props.currentPage === "profile"
              ? styles.userDetailsContainerBorder
              : styles.userDetailsContainer
          }
        >
          <Pressable onPress={handleNavigateToProfile}>
            <Image
              style={styles.image}
              contentFit="cover"
              source={user.profileImage}
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
            {/* <Image
              style={styles.notificationIcon}
              contentFit="contain"
              source={notificationIcon}
            /> */}
            <Notification_Icon />
          </Pressable>
        </View>

        <FlatList
          style={styles.paddingContainer}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
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
          ]}
          renderItem={({ item }) => (
            <>
              <Pressable onPress={() => handleMenuNavigation(item.name)}>
                <Text
                  style={
                    props.currentPage === item.name
                      ? styles.activeMenuItem
                      : styles.inactiveMenuItem
                  }
                >
                  {item.name}
                </Text>
              </Pressable>
              <View style={styles.emptyView}></View>
            </>
          )}
        />
        <Pressable onPress={signOutUser}>
          <Text style={styles.logout}>logout</Text>
        </Pressable>
        <StatusBar
          style="light"
          translucent={false}
          backgroundColor="#0C111F"
        />
      </View>
    </SafeAreaView>
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
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: pixelSizeVertical(24),
    marginBottom: pixelSizeVertical(28),
  },
  closeIcon: {
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
