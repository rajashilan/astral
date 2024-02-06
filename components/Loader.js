import { View, ActivityIndicator } from "react-native";
import React from "react";
import { pixelSizeVertical } from "../utils/responsive-font";

export default function Loader(props) {
  const { style, color } = props;
  return (
    <View
      style={[
        {
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: pixelSizeVertical(100),
        },
        style,
      ]}
    >
      <ActivityIndicator size="large" color={color ? color : "#C4FFF9"} />
    </View>
  );
}
