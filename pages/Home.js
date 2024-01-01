import auth from "@react-native-firebase/auth";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import Notification_Icon from "../assets/Notification_Icon";
import Notification_Alert_Icon from "../assets/Notification_Alert_Icon";
import IosHeight from "../components/IosHeight";
import { getAuthenticatedUser } from "../src/redux/actions/userActions";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const loading = useSelector((state) => state.user.loading);
  const user = useSelector((state) => state.user.credentials);

  //show user's name, intake... photo, and notifications icon

  const [menuItems] = useState([
    { name: "orientation" },
    { name: "clubs" },
    { name: "general forms" },
    { name: "profile" },
  ]);

  const handleMenuNavigation = (name) => {
    const menuItem = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === "staff list") navigation.replace("Stafflist");
    else if (name === "general forms") navigation.replace("GeneralForms");
    else navigation.replace(menuItem.trim());
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user && isEmpty(state.credentials) && !loading) {
        dispatch(getAuthenticatedUser(user.email));
      }
    });
  }, []);

  useEffect(() => {
    if (user.name)
      Toast.show({
        type: "neutral",
        text1: `Welcome back, ${user.name}!`,
      });
  }, [user]);

  const userProfileDisplay = loading ? (
    <View
      style={{
        flexDirection: "row",
        marginBottom: pixelSizeVertical(24),
        paddingRight: pixelSizeHorizontal(16),
        paddingLeft: pixelSizeHorizontal(16),
        paddingTop: pixelSizeVertical(12),
        paddingBottom: pixelSizeVertical(12),
        alignSelf: "center",
      }}
    >
      <View
        style={{
          width: widthPixel(32),
          height: heightPixel(32),
          backgroundColor: "#242997",
          marginRight: pixelSizeHorizontal(16),
        }}
      />
      <View
        style={{
          width: widthPixel(32),
          height: heightPixel(32),
          backgroundColor: "#242997",
          marginRight: pixelSizeHorizontal(16),
        }}
      />
      <View
        style={{
          width: widthPixel(32),
          height: heightPixel(32),
          backgroundColor: "#242997",
        }}
      />
    </View>
  ) : (
    <View
      style={{
        flexDirection: "row",
        marginBottom: pixelSizeVertical(24),
        backgroundColor: "#242997",
        paddingRight: pixelSizeHorizontal(16),
        paddingLeft: pixelSizeHorizontal(16),
        paddingTop: pixelSizeVertical(12),
        paddingBottom: pixelSizeVertical(12),
      }}
    >
      <Pressable onPress={() => navigation.replace("Profile")}>
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
        }}
        onPress={() => navigation.replace("Profile")}
      >
        <Text
          style={{
            color: "#DFE5F8",
            fontSize: fontPixel(22),
            marginBottom: pixelSizeVertical(2),
            fontWeight: "500",
          }}
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
        onPress={() => navigation.replace("Notifications")}
      >
        <Notification_Alert_Icon />
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <IosHeight />
      <View style={styles.list}>
        <Text style={styles.college}>{user.campus}</Text>
        {userProfileDisplay}
        <FlatList
          style={{
            paddingRight: pixelSizeHorizontal(16),
            paddingLeft: pixelSizeHorizontal(16),
          }}
          keyExtractor={(item, index) => index.toString()}
          data={menuItems}
          renderItem={({ item }) => (
            <Pressable
              disabled={loading}
              onPress={() => handleMenuNavigation(item.name)}
            >
              <Text style={[styles.menuItems, { opacity: loading ? 0.5 : 1 }]}>
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#363BB1" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#363BB1",
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
  },
  list: {
    marginBottom: pixelSizeVertical(32),
  },
  menuItems: {
    color: "#07BEB8",
    fontSize: fontPixel(52),
    marginBottom: pixelSizeVertical(25),
    textTransform: "lowercase",
    fontWeight: "400",
  },
  name: {
    color: "#C6CDE2",
    fontSize: fontPixel(36),
    marginTop: pixelSizeVertical(-50),
    fontWeight: "400",
  },
  college: {
    color: "#DFE5F8",
    fontSize: fontPixel(18),
    marginBottom: pixelSizeVertical(24),
    fontWeight: "400",
    textAlign: "center",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  image: {
    width: widthPixel(60),
    height: heightPixel(60),
    marginTop: "auto",
    marginBottom: "auto",
    borderRadius: 50,
  },
});
