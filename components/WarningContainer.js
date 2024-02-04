import { View, Text } from "react-native";
import React from "react";
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
} from "../utils/responsive-font";

export default function WarningContainer(props) {
  const { children, style } = props;
  return (
    <View
      style={[
        {
          backgroundColor: "#a68107",
          marginBottom: pixelSizeVertical(8),
          paddingBottom: pixelSizeVertical(16),
          paddingTop: pixelSizeVertical(16),
          paddingRight: pixelSizeHorizontal(8),
          paddingLeft: pixelSizeHorizontal(8),
          borderRadius: 5,
          display: "flex",
          flexDirection: "column",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
