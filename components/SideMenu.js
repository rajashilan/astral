import React from "react";
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  StyleSheet,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "expo-image";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { firebase } from "../src/firebase/config";
import closeIcon from "../assets/close_icon.png";
import {
  pixelSizeVertical,
  pixelSizeHorizontal,
  fontPixel,
} from "../utils/responsive-font";

const SideMenu = (props) => {
  const navigation = useNavigation();

  const handleMenuNavigation = (name) => {
    props.callParentScreenFunction();
    const menuItem = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === "staff list") navigation.replace("Stafflist");
    else navigation.replace(menuItem.trim());
  };

  const signOutUser = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        props.callParentScreenFunction();
        navigation.replace("Login");
      })
      .catch(function (error) {
        // An error happened.
        console.error(error);
      });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.paddingContainer}>
        <View style={styles.closeContainer}>
          <Pressable
            onPress={props.callParentScreenFunction}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Image
              style={styles.closeIcon}
              source={closeIcon}
              contentFit="contain"
            />
          </Pressable>
        </View>
        <FlatList
          style={styles.list}
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
              name: "department",
            },
            {
              name: "profile",
            },
            {
              name: "staff list",
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
  },
});

export default SideMenu;
