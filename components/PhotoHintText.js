import React from "react";
import { StyleSheet, Text } from "react-native";
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

export default function PhotoHintText(props) {
  const { highlight } = props;
  return (
    <Text
      style={
        !highlight ? styles.changeImageText : styles.changeImageTextHighlight
      }
    >
      tap on the photo to add a way better one
    </Text>
  );
}

const styles = StyleSheet.create({
  changeImageText: {
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#DFE5F8",
    opacity: 0.4,
    marginBottom: pixelSizeVertical(12),
    textAlign: "center",
  },
  changeImageTextHighlight: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C4FFF9",
    opacity: 1,
    marginBottom: pixelSizeVertical(12),
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
