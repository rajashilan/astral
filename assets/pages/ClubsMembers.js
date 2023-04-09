import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React, { useState } from "react";
import member1 from "../../assets/member1.png";
import member2 from "../../assets/member2.png";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../../utils/responsive-font";
import { Image } from "expo-image";
import Carousel, { Pagination } from "react-native-snap-carousel";

const { width } = Dimensions.get("window");

export default function ClubsMembers(props) {
  const [data, setData] = useState([
    {
      members: 13,
      membersData: [
        {
          name: "Jonathan",
          year: 3,
          course: "BCSCU",
          role: "President",
          quote: "May the force be with you",
          image: member1,
        },
        {
          name: "Kelly",
          year: 2,
          course: "BCSCU",
          role: "Vice President",
          quote: "I am your mother",
          image: member2,
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
      <Text style={styles.header}>{data[0].members} members</Text>
      <Carousel
        layout="default"
        data={data[0].membersData}
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
            <Text style={styles.name}>
              {item.name} - Year {item.year}, {item.course}
            </Text>
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.quote}>"{item.quote}"</Text>
          </>
        )}
      />
      <Pagination
        inactiveDotColor="#546593"
        dotColor={"#07BEB8"}
        activeDotIndex={indexSelected}
        dotsLength={data[0].membersData.length}
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
    height: 280,
    marginBottom: pixelSizeVertical(26),
  },
  name: {
    fontSize: fontPixel(18),
    fontWeight: 500,
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(4),
  },
  role: {
    fontSize: fontPixel(18),
    fontWeight: 500,
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(10),
  },
  quote: {
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
