import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions, Text, Pressable } from "react-native";
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

const { width } = Dimensions.get("window");

export default function Event(props) {
  const { data, title, content, date } = props;

  const [indexSelected, setIndexSelected] = useState(0);
  const [isUpcoming, setIsUpcoming] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false); // State to toggle full text
  const [isClipped, setIsClipped] = useState(false); // State to check if text is clipped
  const textRef = useRef(null); // Ref to access the text element

  const handleTextLayout = (e) => {
    const { height } = e.nativeEvent.layout; // Get the height of the Text component
    if (height > 45) {
      // Threshold to decide if the text is clipped (adjust as needed)
      setIsClipped(true);
    }
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

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
          ref={textRef}
          onLayout={handleTextLayout} // Track the layout of the Text component
          numberOfLines={isExpanded ? 0 : 3} // Show 3 lines or full text based on `isExpanded`
          ellipsizeMode="tail" // Show ellipsis ("...") when text overflows
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
      {isClipped && !isExpanded && (
        <Pressable onPress={toggleExpand}>
          <Text style={{ color: "#8C91FB", marginTop: 5 }}>Show more</Text>
        </Pressable>
      )}

      {isExpanded && (
        <Pressable onPress={toggleExpand}>
          <Text style={{ color: "#8C91FB", marginTop: 5 }}>Show less</Text>
        </Pressable>
      )}
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
