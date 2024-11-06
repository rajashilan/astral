import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
  widthPixel,
} from "../../utils/responsive-font";
import FastImage from "react-native-fast-image";
import dayjs from "dayjs";
import WarningDot from "../../assets/WarningDot";

const { width } = Dimensions.get("window");

export default function Event(props) {
  const { data, title, content, date } = props;

  const [indexSelected, setIndexSelected] = useState(0);
  const [isUpcoming, setIsUpcoming] = useState(false);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  useEffect(() => {
    let currentDate = new Date().toISOString();
    currentDate = currentDate.split("T")[0];

    if (date.split("T")[0] > currentDate) {
      setIsUpcoming(true);
    }
  }, []);

  return (
    <View>
      {title ? (
        <Text
          style={{
            fontSize: fontPixel(16),
            fontWeight: "500",
            color: "#DFE5F8",
            marginTop: pixelSizeVertical(8),
          }}
        >
          {title}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: pixelSizeVertical(4),
        }}
      >
        <Text
          style={{
            fontSize: fontPixel(12),
            fontWeight: "400",
            color: "#A7AFC7",
          }}
        >
          {dayjs(date.split("T")[0]).format("D MMM YYYY")}
        </Text>
        {isUpcoming ? (
          <Text
            style={{
              fontSize: fontPixel(12),
              fontWeight: "500",
              color: "#E3B536",
              marginLeft: pixelSizeHorizontal(8),
              marginBottom: pixelSizeVertical(2),
            }}
          >
            upcoming event
          </Text>
        ) : null}
      </View>
      {content ? (
        <Text
          style={{
            marginTop: pixelSizeVertical(8),
            fontSize: fontPixel(14),
            fontWeight: "400",
            color: "#C6CDE2",
          }}
        >
          {content}
        </Text>
      ) : null}
      <View
        style={{
          marginTop: pixelSizeVertical(10),
        }}
      >
        <Carousel
          layout="default"
          data={data}
          disableIntervalMomentum
          onSnapToItem={(index) => onSelect(index)}
          sliderWidth={width - 32}
          itemWidth={width - 32}
          useExperimentalSnap
          renderItem={({ item, index }) => (
            <>
              <FastImage
                key={index}
                style={{
                  alignSelf: "center",
                  width: "100%",
                  height: heightPixel(300),
                  borderRadius: 5,
                }}
                transition={1000}
                resizeMode="cover"
                source={{ uri: item }}
                progressiveRenderingEnabled={true}
                cache={FastImage.cacheControl.immutable}
                priority={FastImage.priority.normal}
              />
            </>
          )}
        />
      </View>
      <Pagination
        inactiveDotColor="#546593"
        dotColor="#C4FFF9"
        activeDotIndex={indexSelected}
        containerStyle={{
          paddingTop: 0,
          paddingBottom: 0,
          alignSelf: "center",
          marginTop: pixelSizeVertical(12),
        }}
        dotsLength={data.length}
        inactiveDotScale={1}
      />
    </View>
  );
}
