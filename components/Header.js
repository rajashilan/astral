import { StyleSheet, Text } from "react-native";
import React from "react";

import { fontPixel, pixelSizeVertical } from "../utils/responsive-font";

export default function Header(props) {
  return <Text style={styles.header}>{props.header}</Text>;
}

const styles = StyleSheet.create({
  header: {
    fontSize: fontPixel(42),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(18),
  },
});
