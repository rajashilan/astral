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

export default function ClubsEvents() {
  //can have image, must have title, must have date, can have text

  const [innerTab, setInnerTab] = useState("past");

  const [data, setData] = useState([
    {
      past: [
        {
          image: club1,
          title: "ALS Charity Event",
          date: "30th March 2023",
          content:
            "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam.",
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
      ],
      future: [
        {
          image: club1,
          title: "ALS Future Event",
          date: "To be announced",
          content: "Lorem ipsum dolor sit amet, consetetur ",
        },
        {
          title: "Free food Coming soon",
          date: "31st March 2023",
          content:
            "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.",
        },
        {
          title: "ALS Future Event",
          date: "To be announced",
        },
        {
          title: "ALS Future Event",
          date: "To be announced",
        },
      ],
    },
  ]);

  const [indexSelected, setIndexSelected] = useState(0);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  return (
    <View style={styles.container}>
      <View style={styles.onlySpan}>
        <Pressable
          onPress={() => {
            setInnerTab("past");
          }}
        >
          <Text
            style={
              innerTab === "past"
                ? styles.innerTabActive
                : styles.innerTabInactive
            }
          >
            past
          </Text>
        </Pressable>
        <Pressable>
          <Text
            style={
              innerTab === "future"
                ? styles.innerTabActive
                : styles.innerTabInactive
            }
            onPress={() => {
              setInnerTab("future");
            }}
          >
            future
          </Text>
        </Pressable>
      </View>
      <Pagination
        inactiveDotColor="#546593"
        dotColor={"#C4FFF9"}
        activeDotIndex={indexSelected}
        containerStyle={{
          paddingTop: 0,
          paddingRight: pixelSizeHorizontal(16),
          paddingLeft: pixelSizeHorizontal(16),
          paddingBottom: 0,
          marginBottom: pixelSizeVertical(12),
        }}
        dotsLength={
          innerTab === "past" ? data[0].past.length : data[0].future.length
        }
        inactiveDotScale={1}
      />
      <Carousel
        layout="default"
        data={innerTab === "past" ? data[0].past : data[0].future}
        onSnapToItem={(index) => onSelect(index)}
        sliderWidth={width - 32}
        itemWidth={width - 32}
        disableIntervalMomentum={true}
        useExperimentalSnap={true}
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
      <View style={styles.emptyView} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingTop: pixelSizeVertical(4),
  },
  header: {
    fontSize: fontPixel(26),
    fontWeight: "500",
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(16),
  },
  innerTabActive: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#C4FFF9",
    marginTop: pixelSizeVertical(-8),
    marginBottom: pixelSizeVertical(20),
  },
  innerTabInactive: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#C4FFF9",
    marginTop: pixelSizeVertical(-8),
    marginBottom: pixelSizeVertical(20),
    opacity: 0.5,
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
  date: {
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#A7AFC7",
    marginBottom: pixelSizeVertical(10),
  },
  content: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
  },
  loginButton: {
    color: "#07BEB8",
    fontSize: fontPixel(78),
    textTransform: "lowercase",
    fontWeight: 700,
    textDecorationLine: "underline",
  },
  onlySpan: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: pixelSizeHorizontal(2),
    paddingLeft: pixelSizeHorizontal(2),
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(30),
    backgroundColor: "#0C111F",
  },
});
