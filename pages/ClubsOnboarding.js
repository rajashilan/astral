import FastImage from "react-native-fast-image";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { data } from "../utils/clubsOnboardingData";
import RenderClubOnboardingItem from "../components/RenderClubOnboardingItem";
import { useDispatch } from "react-redux";
import { SHOW_CLUB_ONBOARDING } from "../src/redux/type";

const ITEM_WIDTH = Dimensions.get("window").width; // Adjust this if your items have different widths

export default function ClubsOnboarding({ navigation }) {
  const flatListRef = useAnimatedRef();
  const x = useSharedValue(0);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: SHOW_CLUB_ONBOARDING, payload: false });
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const onSkipPress = () => {
    navigation.replace("Clubs");
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item, index }) => {
          return (
            <RenderClubOnboardingItem
              item={item}
              index={index}
              x={x}
              onSkipPress={onSkipPress}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
