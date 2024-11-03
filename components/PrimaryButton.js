import React from "react";
import { Pressable, Text, StyleSheet, ActivityIndicator } from "react-native";

import {
  pixelSizeHorizontal,
  pixelSizeVertical,
  fontPixel,
  heightPixel,
} from "../utils/responsive-font";

const PrimaryButton = ({
  onPress,
  loading,
  text,
  buttonStyle,
  textStyle,
  conditionToDisable,
}) => {
  //custom styling
  //custom text
  //onpress

  return (
    <Pressable
      style={[
        styles.loginButton,
        { opacity: loading ? 0.5 : conditionToDisable ? 0.5 : 1 },
        buttonStyle,
      ]}
      onPress={onPress}
      disabled={conditionToDisable ? loading || conditionToDisable : loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#DFE5F8" />
      ) : (
        <Text style={[styles.loginButtonText, textStyle]}>{text}</Text>
      )}
    </Pressable>
  );
};

// Default styles
const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "#07BEB8",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    justifyContent: "center",
    marginTop: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(24),
    width: "100%",
    height: heightPixel(62),
    borderRadius: 5,
  },
  loginButtonDisabled: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(24),
    width: "100%",
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#0C111F",
    textAlign: "center",
  },
  loginButtonLoadingText: {
    fontSize: fontPixel(22),
    fontWeight: "400",
    color: "#DFE5F8",
    textAlign: "center",
  },
});

export default PrimaryButton;
