import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useSelector } from "react-redux";

import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

const { width } = Dimensions.get("window");

const ClubsMembers = React.memo((props) => {
  const members = useSelector((state) => state.data.clubData.members);
  const numberOfMembers = `${members.length} members`;

  const [indexSelected, setIndexSelected] = useState(0);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  return (
    <View style={styles.container}>
      {numberOfMembers && <Text style={styles.header}>{numberOfMembers}</Text>}
      <Pagination
        inactiveDotColor="#546593"
        dotColor="#C4FFF9"
        activeDotIndex={indexSelected}
        containerStyle={{
          paddingTop: 0,
          paddingRight: pixelSizeHorizontal(16),
          paddingLeft: pixelSizeHorizontal(16),
          paddingBottom: 0,
          marginBottom: pixelSizeVertical(12),
        }}
        dotsLength={members && members.length}
        inactiveDotScale={1}
      />
      <Carousel
        layout="default"
        data={members && members}
        disableIntervalMomentum
        useExperimentalSnap
        onSnapToItem={(index) => onSelect(index)}
        sliderWidth={width - 32}
        itemWidth={width - 32}
        renderItem={({ item, index }) => (
          <>
            <Image
              key={index}
              style={styles.image}
              contentFit="cover"
              source={item.profileImage}
            />
            <Text style={styles.role}>{item.role}</Text>
            <Text style={styles.name}>
              {item.name} - Intake {item.intake}, {item.department}
            </Text>
            <Text style={styles.quote}>{item.bio && item.bio}</Text>
          </>
        )}
      />
      <View style={styles.emptyView} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingTop: pixelSizeVertical(4),
  },
  header: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#F5F5F5",
    marginBottom: pixelSizeVertical(20),
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: heightPixel(280),
    marginBottom: pixelSizeVertical(12),
    borderRadius: 5,
  },
  role: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(4),
  },
  name: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  quote: {
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

export default ClubsMembers;
