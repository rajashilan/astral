import React from "react";
import { Pressable, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { fontPixel, pixelSizeVertical } from "../../utils/responsive-font";

export default function File(props) {
  const { file } = props;

  return (
    <View
      style={{
        marginTop: pixelSizeVertical(14),
      }}
    >
      <Pressable
        key={file.url}
        onPress={async () => await WebBrowser.openBrowserAsync(file.url)}
      >
        <Text
          style={{
            fontSize: fontPixel(22),
            fontWeight: "500",
            color: "#BE5007",
            marginBottom: pixelSizeVertical(10),
            textDecorationLine: "underline",
          }}
        >
          {file.name}
        </Text>
      </Pressable>
    </View>
  );
}
