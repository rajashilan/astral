import { StyleSheet, View } from "react-native";
import React, { Component } from "react";
import { pixelSizeVertical } from "../utils/responsive-font";

export default class EmptyView extends Component {
  render() {
    return <View style={styles.emptyView}></View>;
  }
}

const styles = StyleSheet.create({
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
  },
});
