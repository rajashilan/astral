import React from "react";
import { FlatList, StyleSheet, View, Text, Pressable } from "react-native";
import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import * as WebBrowser from "expo-web-browser";

const urlRegex =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

export default function LinksView(props) {
  let { content } = props;

  const handleOpenLink = (link) => {
    WebBrowser.openBrowserAsync(link);
  };

  return (
    <>
      {urlRegex.test(content) ? (
        <FlatList
          data={content.match(urlRegex)}
          horizontal={false}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              style={styles.linkContainer}
              onPress={() => handleOpenLink(item)}
            >
              <Text style={styles.linkContent}>{item}</Text>
            </Pressable>
          )}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  linkContent: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#5170D6",
  },
  linkContainer: {
    paddingTop: pixelSizeVertical(4),
    paddingBottom: pixelSizeVertical(4),
    paddingRight: pixelSizeHorizontal(10),
    paddingLeft: pixelSizeHorizontal(10),
    backgroundColor: "#232F52",
    borderRadius: 5,
    marginRight: pixelSizeHorizontal(10),
    marginTop: pixelSizeVertical(10),
  },
});
