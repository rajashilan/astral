import React from "react";
import { StyleSheet, View } from "react-native";
import { pixelSizeVertical } from "../utils/responsive-font";

const EmptyView = (props) => {
  const { backgroundColor } = props;

  return (
    <View
      style={[
        styles.emptyView,
        { backgroundColor: backgroundColor ? backgroundColor : "#0C111F" },
      ]}
    ></View>
  );
};

const styles = StyleSheet.create({
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
  },
});

export default EmptyView;
