import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import {
  heightPixel,
  pixelSizeVertical,
  widthPixel,
} from "../../utils/responsive-font";
import FastImage from "react-native-fast-image";

const { width } = Dimensions.get("window");

export default function Photos(props) {
  const { data } = props;

  const [indexSelected, setIndexSelected] = useState(0);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  return (
    <View
      style={{
        marginTop: pixelSizeVertical(14),
      }}
    >
      <View>
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
