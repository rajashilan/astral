import { StyleSheet, Text, View, FlatList, Pressable } from "react-native";
import React, { useState } from "react";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../../utils/responsive-font";
import { StatusBar } from "expo-status-bar";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";

export default function Orientation({ navigation }) {
  const [pages, setPages] = useState([
    { page: "first day", id: 1 },
    { page: "second day", id: 2 },
    { page: "campus tour", id: 3 },
  ]);

  const handlePageItemPress = () => {
    navigation.navigate("OrientationPages");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>orientation</Text>

      <VideoPlayer
        style={styles.video}
        videoProps={{
          resizeMode: ResizeMode.CONTAIN,
          source: {
            uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          },
        }}
      />

      <Text style={styles.title}>
        welcome to inti international college penang!
      </Text>

      <FlatList
        style={styles.list}
        keyExtractor={(item, index) => index.toString()}
        data={pages}
        renderItem={({ item }) => (
          <Pressable onPress={handlePageItemPress}>
            <Text style={styles.pageItems}>{item.page}</Text>
          </Pressable>
        )}
      />

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(82),
    paddingBottom: pixelSizeVertical(16),
  },
  header: {
    fontSize: fontPixel(56),
    fontWeight: 500,
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(28),
  },
  title: {
    fontSize: fontPixel(26),
    fontWeight: 500,
    color: "#F5F5F5",
    marginTop: pixelSizeVertical(18),
    marginBottom: pixelSizeVertical(30),
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  pageItems: {
    fontSize: fontPixel(34),
    fontWeight: 500,
    color: "#07BEB8",
    marginBottom: pixelSizeVertical(20),
    textDecorationLine: "underline",
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
  },
});
