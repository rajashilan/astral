import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { StatusBar } from "expo-status-bar";

export default function Home({ navigation }) {
  const [menuItems] = useState([
    { name: "orientation" },
    { name: "clubs" },
    { name: "department" },
    { name: "test" },
    { name: "profile" },
    { name: "staff list" },
  ]);

  const handleMenuNavigation = (name) => {
    const menuItem = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === "staff list") navigation.replace("Stafflist");
    else navigation.replace(menuItem.trim());
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        keyExtractor={(item, index) => index.toString()}
        data={menuItems}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleMenuNavigation(item.name)}>
            <Text style={styles.menuItems}>{item.name}</Text>
          </Pressable>
        )}
      />
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
});
