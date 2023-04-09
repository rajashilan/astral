import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../../utils/responsive-font";

export default function Stafflist() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>StaffList</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(30),
  },
  title: {
    fontSize: fontPixel(26),
    fontWeight: 500,
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(10),
  },
});
