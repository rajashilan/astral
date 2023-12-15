import FastImage from "react-native-fast-image";
import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";

import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

export default function DepartmentFeatured(props) {
  const [data] = useState([
    {
      department: "Department of Computing and Engineering",
      featured: [
        {
          content:
            "We’ll be having a charity event on the 9th of April 2023, to sign up, please fill up the form below. Thank you! https://google.form/asdj3ds9",
          id: 1,
        },
        {
          content:
            "Hello all, please feel free to join us for the IBM bootcamp this Saturday at 5pm!",
          id: 2,
        },
        {
          content:
            "Please refer to the file below for your new and updated timetable.",
          file: "timetable-new",
          id: 3,
        },
      ],
    },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={data[0].featured}
        renderItem={({ item, index }) => (
          <View style={styles.contentContainer}>
            {item.content && <Text style={styles.content}>{item.content}</Text>}
            {item.image && (
              <FastImage
                key={index}
                style={styles.image}
                resizeMode="cover"
                source={{ uri: item.image }}
                progressiveRenderingEnabled={true}
                cache={FastImage.cacheControl.immutable}
                priority={FastImage.priority.normal}
              />
            )}
            {item.file && (
              <Pressable>
                <Text style={styles.file}>{item.file}</Text>
              </Pressable>
            )}
          </View>
        )}
      />
      <View style={styles.emptyView} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingTop: pixelSizeVertical(20),
  },
  title: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  titleMarginTop: {
    marginTop: pixelSizeVertical(16),
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  contentContainer: {
    paddingTop: pixelSizeVertical(20),
    paddingBottom: pixelSizeVertical(20),
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    backgroundColor: "#131A2E",
    marginBottom: pixelSizeVertical(10),
  },
  content: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    marginBottom: pixelSizeVertical(10),
    lineHeight: 22,
  },
  image: {
    width: "100%",
    height: 190,
    marginBottom: pixelSizeVertical(10),
    borderRadius: 5,
  },
  file: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#BE5007",
    marginBottom: pixelSizeVertical(10),
    textDecorationLine: "underline",
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
  },
});
