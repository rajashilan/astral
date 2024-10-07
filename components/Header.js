import React from "react";
import { StyleSheet, Text } from "react-native";

import { fontPixel, pixelSizeVertical } from "../utils/responsive-font";

export default function Header(props) {
  const { style } = props;
  return <Text style={[styles.header, style]}>{props.header}</Text>;
}

const styles = StyleSheet.create({
  header: {
    fontSize: fontPixel(34),
    fontWeight: "500",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(18),
  },
});
