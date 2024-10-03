import React from "react";
import { StyleSheet, Text } from "react-native";
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

export default function PhotoHintText() {
  return <Text style={styles.changeImageText}>tap on the photo to update</Text>;
}

const styles = StyleSheet.create({
  changeImageText: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#DFE5F8",
    opacity: 0.4,
    marginBottom: pixelSizeVertical(10),
    marginLeft: pixelSizeHorizontal(5),
  },
});
