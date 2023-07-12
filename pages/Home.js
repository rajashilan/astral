import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { StatusBar } from "expo-status-bar";

import IosHeight from "../components/IosHeight";

import { firebase } from "../src/firebase/config";

import { useDispatch, useSelector } from "react-redux";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

export default function Home({ navigation }) {
  const state = useSelector((state) => state.user);
  const loading = useSelector((state) => state.user.loading);
  console.log(loading);

  const [menuItems] = useState([
    { name: "orientation" },
    { name: "clubs" },
    { name: "department" },
    { name: "profile" },
    { name: "staff list" },
  ]);

  const handleMenuNavigation = (name) => {
    const menuItem = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === "staff list") navigation.replace("Stafflist");
    else navigation.replace(menuItem.trim());
  };
  console.log(loading);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
      } else {
        navigation.navigate("Main");
        console.log("logged out");
      }
    });
  }, []);

  useEffect(() => {
    if (state.credentials.name)
      Toast.show({
        type: "neutral",
        text1: `Welcome back, ${state.credentials.name}!`,
      });
  }, [state.credentials]);

  return (
    <View style={styles.container}>
      <IosHeight />
      <FlatList
        style={styles.list}
        keyExtractor={(item, index) => index.toString()}
        data={menuItems}
        renderItem={({ item }) => (
          <Pressable
            disabled={loading}
            onPress={() => handleMenuNavigation(item.name)}
          >
            <Text style={styles.menuItems}>{item.name}</Text>
          </Pressable>
        )}
      />
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
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
  },
  list: {
    marginTop: pixelSizeVertical(100),
  },
  menuItems: {
    color: "#07BEB8",
    fontSize: fontPixel(52),
    marginBottom: pixelSizeVertical(25),
    textTransform: "lowercase",
    fontWeight: 400,
  },
  name: {
    color: "#C6CDE2",
    fontSize: fontPixel(36),
    marginTop: pixelSizeVertical(-50),
    fontWeight: 400,
  },
});
