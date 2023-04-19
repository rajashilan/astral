import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import img1 from "../assets/club1.png";
import img2 from "../assets/club2.png";

export default function DepartmentSaved(props) {
  const [data, setData] = useState([
    {
      department: "Department of Computing and Engineering",
      saved: [
        {
          content:
            "Please refer to the file below for your new and updated timetable.",
          file: "timetable-new",
          id: 3,
        },
        {
          content:
            "Today’s 380CT class has been cancelled. Replacement will be announced soon.",
          id: 4,
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
        data={data[0].saved}
        renderItem={({ item, index }) => (
          <View style={styles.contentContainer}>
            {item.content && <Text style={styles.content}>{item.content}</Text>}
            {item.image && (
              <Image
                key={index}
                style={styles.image}
                resizeMode="cover"
                source={item.image}
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