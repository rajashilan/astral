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
} from "../../utils/responsive-font";

import club1 from "../../assets/club1.png";
import club2 from "../../assets/club2.png";
import club3 from "../../assets/club3.png";

const { width } = Dimensions.get("window");

export default function ClubsEvents() {
  //can have image, must have title, must have date, can have text
  const [data, setData] = useState([
    {
      image: club1,
      title: "ALS Charity Event",
      date: "30th March 2023",
      content:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam.",
    },
    {
      title: "Free food for all",
      date: "12th March 2023",
      content:
        "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.",
    },
    {
      title: "ALS Charity Event",
      date: "30th March 2023",
    },
  ]);

  const [indexSelected, setIndexSelected] = useState(0);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  return (
    <View style={styles.container}>
      <Carousel
        layout="default"
        data={data}
        onSnapToItem={(index) => onSelect(index)}
        sliderWidth={width - 32}
        itemWidth={width - 32}
        renderItem={({ item, index }) => (
          <>
            {item.image && (
              <Image
                key={index}
                style={styles.image}
                resizeMode="cover"
                source={item.image}
              />
            )}
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.date}>{item.date}</Text>
            {item.content && <Text style={styles.content}>{item.content}</Text>}
          </>
        )}
      />
      <Pagination
        inactiveDotColor="#546593"
        dotColor={"#07BEB8"}
        activeDotIndex={indexSelected}
        dotsLength={data.length}
        inactiveDotScale={1}
      />
      <Pressable style={styles.button}>
        <View style={styles.onlySpan}>
          <Text style={styles.loginButtonNoUnderline}>j</Text>
          <Text style={styles.loginButton}>oin</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(30),
  },
  header: {
    fontSize: fontPixel(26),
    fontWeight: 500,
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(16),
  },
  image: {
    width: "100%",
    height: 170,
    marginBottom: pixelSizeVertical(26),
  },
  title: {
    fontSize: fontPixel(18),
    fontWeight: 500,
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(4),
  },
  date: {
    fontSize: fontPixel(14),
    fontWeight: 300,
    color: "#DBDBDB",
    marginBottom: pixelSizeVertical(16),
  },
  content: {
    fontSize: fontPixel(16),
    fontWeight: 300,
    color: "#EFEFEF",
  },
  loginButton: {
    color: "#C4FFF9",
    fontSize: fontPixel(78),
    textTransform: "lowercase",
    fontWeight: 700,
    textDecorationLine: "underline",
  },
  loginButtonNoUnderline: {
    color: "#C4FFF9",
    fontSize: fontPixel(78),
    textTransform: "lowercase",
    fontWeight: 700,
  },
  button: {
    marginTop: pixelSizeVertical(-16),
    marginBottom: pixelSizeVertical(40),
  },
  onlySpan: {
    flexDirection: "row",
  },
});
