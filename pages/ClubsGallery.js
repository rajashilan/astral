import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React, { useState } from "react";
import { Image } from "expo-image";
import Carousel, { Pagination } from "react-native-snap-carousel";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

import club1 from "../assets/club1.png";
import club2 from "../assets/club2.png";
import club3 from "../assets/club3.png";

const { width } = Dimensions.get("window");

export default function ClubsGallery() {
  const [data, setData] = useState([
    {
      image: club1,
      title: "A visit to hawker stalls",
      content:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam.",
    },
    {
      image: club2,
      title: "Hello darkness my old friend",
      content:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliqu",
    },
    {
      image: club3,
      title: "A small trip",
    },
  ]);

  const [indexSelected, setIndexSelected] = useState(0);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  return (
    <View style={styles.container}>
      <Pagination
        inactiveDotColor="#546593"
        dotColor={"#07BEB8"}
        activeDotIndex={indexSelected}
        containerStyle={{
          paddingTop: 0,
          paddingRight: pixelSizeHorizontal(16),
          paddingLeft: pixelSizeHorizontal(16),
          paddingBottom: 0,
          marginBottom: pixelSizeVertical(12),
        }}
        dotsLength={data.length}
        inactiveDotScale={1}
      />
      <Carousel
        layout="default"
        data={data}
        onSnapToItem={(index) => onSelect(index)}
        sliderWidth={width - 32}
        itemWidth={width - 32}
        renderItem={({ item, index }) => (
          <>
            <Image
              key={index}
              style={styles.image}
              resizeMode="cover"
              source={item.image}
            />
            {item.title && <Text style={styles.title}>{item.title}</Text>}
            {item.content && <Text style={styles.content}>{item.content}</Text>}
          </>
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
  image: {
    width: "100%",
    height: 170,
    marginBottom: pixelSizeVertical(12),
    borderRadius: 5,
  },
  title: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(4),
  },
  content: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
  },
  onlySpan: {
    flexDirection: "row",
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(30),
    backgroundColor: "#0C111F",
  },
});
