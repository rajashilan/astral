import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import { Link } from "@react-navigation/native";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { ScrollView } from "react-native-gesture-handler";

const urlRegex =
  /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

export default function DepartmentAll(props) {
  const [data, setData] = useState([
    {
      department: "Department of Computing and Engineering",
      all: [
        {
          content:
            "We’ll be having a charity https://youtube.com event on the 9th of April 2023  https://google.com, to sign up, please fill up https://bing.com the form below. Thank you! https://google.form/asdj3ds9",
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
        {
          content:
            "Today’s 380CT class has been cancelled. Replacement will be announced soon.",
          id: 4,
        },
        {
          content: "Welcome January intake students!",
          id: 5,
        },
      ],
    },
  ]);

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        scrollEnabled={false}
        data={data[0].all}
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
            {urlRegex.test(item.content) && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <FlatList
                  data={item.content.match(urlRegex)}
                  numColumns={item.content.match(urlRegex).length}
                  scrollEnabled={true}
                  renderItem={({ item, index }) => (
                    <View style={styles.linkContainer}>
                      <Text style={styles.linkContent}>{item}</Text>
                    </View>
                  )}
                />
              </ScrollView>
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
