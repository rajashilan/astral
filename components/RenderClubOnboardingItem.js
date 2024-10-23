import FastImage from "react-native-fast-image";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  useWindowDimensions,
} from "react-native";
import {
  fontPixel,
  heightPixel,
  pixelSizeHorizontal,
  pixelSizeVertical,
} from "../utils/responsive-font";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function RenderClubOnboardingItem(props) {
  const { item, index, x, onSkipPress } = props;
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const circleAnimation = useAnimatedStyle(() => {
    const scale = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [1, 4, 4],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale: scale }],
    };
  });

  const elementsAnimationStyle = useAnimatedStyle(() => {
    const translateYAnimation = interpolate(
      x.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [200, 0, -200],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY: translateYAnimation }],
    };
  });

  return (
    <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            {
              width: SCREEN_WIDTH,
              height: SCREEN_WIDTH,
              backgroundColor: item.background,
              borderRadius: SCREEN_WIDTH / 2,
            },
            circleAnimation,
          ]}
        ></Animated.View>
      </View>
      <Animated.View style={elementsAnimationStyle}>
        <FastImage
          key={index}
          style={{
            width: SCREEN_WIDTH - 32,
            height: SCREEN_WIDTH * 0.9,
            marginBottom: pixelSizeVertical(12),
          }}
          resizeMode="contain"
          source={item.image}
          progressiveRenderingEnabled={true}
          cache={FastImage.cacheControl.immutable}
          priority={FastImage.priority.normal}
        />
      </Animated.View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
      {item.isFinal ? (
        <Pressable
          onPress={onSkipPress}
          style={[
            styles.button,
            {
              borderColor: item.highlight,
            },
          ]}
        >
          <Text style={styles.buttonText}>get started!</Text>
        </Pressable>
      ) : null}

      <View style={styles.dotsContainer}>
        {Array.from({ length: 4 }).map((_, dotIndex) => (
          <View
            key={dotIndex}
            style={[
              styles.dot,
              {
                opacity: index === dotIndex ? 1 : 0.2,
                backgroundColor: item.highlight,
              },
            ]}
          />
        ))}
      </View>

      {!item.isFinal ? (
        <Pressable onPress={onSkipPress} style={styles.skipWrapper}>
          <Text style={styles.skip}>skip</Text>
        </Pressable>
      ) : null}

      <View
        style={{
          height: pixelSizeVertical(32),
          backgroundColor: item.background,
        }}
      ></View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: pixelSizeHorizontal(32),
  },
  title: {
    fontSize: fontPixel(34),
    fontWeight: "700",
    color: "#18191A",
    marginHorizontal: pixelSizeHorizontal(20),
    marginTop: pixelSizeVertical(50),
    width: "100%",
    textAlign: "center",
  },
  subtitle: {
    fontSize: fontPixel(18),
    fontWeight: "400",
    color: "#2C2C2C",
    marginHorizontal: pixelSizeHorizontal(20),
    marginTop: pixelSizeVertical(12),
    width: "100%",
    textAlign: "center",
    lineHeight: 26,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: pixelSizeVertical(24),
  },
  dot: {
    height: pixelSizeVertical(14),
    width: pixelSizeVertical(14),
    borderRadius: 14,
    marginRight: pixelSizeHorizontal(5),
  },
  button: {
    width: "100%",
    paddingHorizontal: pixelSizeHorizontal(16),
    paddingVertical: pixelSizeVertical(12),
    borderRadius: 5,
    borderWidth: 3,
    marginTop: pixelSizeVertical(24),
  },
  buttonText: {
    fontSize: fontPixel(22),
    fontWeight: "700",
    color: "#18191A",
    textAlign: "center",
  },
  skipWrapper: {
    position: "absolute",
    bottom: pixelSizeVertical(32), // Adjust as needed
    alignItems: "center",
    width: "100%",
  },
  skip: {
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#585858",
    textAlign: "center",
  },
  circleContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
