import React from "react";
import { StyleSheet, View, Platform } from "react-native";

import { pixelSizeVertical } from "../utils/responsive-font";

export default function IosHeight(props) {
  return <View style={styles.iosHeight} />;
}

const styles = StyleSheet.create({
  iosHeight: {
    height: Platform.OS === "ios" ? pixelSizeVertical(32) : 0,
  },
});
