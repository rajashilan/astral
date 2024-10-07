import { StyleSheet, Text, TextInput } from "react-native";
import React from "react";
import {
  pixelSizeHorizontal,
  pixelSizeVertical,
  fontPixel,
} from "../utils/responsive-font";

export default function CustomTextInput(props) {
  const {
    label,
    placeholder,
    value,
    multiline,
    numberOfLines,
    onChangeText,
    labelStyle,
    inputStyle,
    editable,
    secureTextEntry,
  } = props;
  return (
    <>
      {label && (
        <Text
          style={[
            {
              textAlign: "left",
              alignSelf: "flex-start",
              fontSize: 12,
              color: "#A7AFC7",
              marginBottom: pixelSizeVertical(-6),
              marginTop: pixelSizeVertical(14),
              paddingLeft: pixelSizeHorizontal(12),
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}
      <TextInput
        editable={editable}
        style={[styles.textInput, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#A7AFC7"
        value={value}
        multiline={multiline}
        numberOfLines={numberOfLines}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        textAlignVertical="top"
      />
    </>
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(12),
    paddingLeft: pixelSizeHorizontal(12),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    width: "100%",
    borderRadius: 5,
    marginTop: pixelSizeVertical(10),
  },
});
