import { StyleSheet, Text, View, Dimensions, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import Carousel, { Pagination } from "react-native-snap-carousel";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

const { width } = Dimensions.get("window");

import { useSelector, useDispatch } from "react-redux";

import { firebase } from "../src/firebase/config";
import { getClubGallery } from "../src/redux/actions/dataActions";
const db = firebase.firestore();

export default function ClubsGallery({ navigation }) {
  const dispatch = useDispatch();
  const club = useSelector((state) => state.data.clubData.club);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const data = useSelector((state) => state.data.clubData.gallery);

  const [indexSelected, setIndexSelected] = useState(0);

  useEffect(() => {
    dispatch(getClubGallery(club.clubID));
  }, []);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  return (
    <View style={styles.container}>
      {currentMember.role === "president" && (
        <Pressable
          style={styles.loginButton}
          onPress={() => {
            navigation.navigate("AddClubsGallery");
          }}
        >
          <Text style={styles.loginButtonText}>add a photo</Text>
        </Pressable>
      )}

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
        dotsLength={data.length}
        inactiveDotScale={1}
      />
      <Carousel
        layout="default"
        data={data}
        disableIntervalMomentum={true}
        useExperimentalSnap={true}
        onSnapToItem={(index) => onSelect(index)}
        sliderWidth={width - 32}
        itemWidth={width - 32}
        renderItem={({ item, index }) => (
          <>
            <Image
              key={index}
              style={styles.image}
              contentFit="cover"
              source={item.image}
            />
            {item.title && <Text style={styles.title}>{item.title}</Text>}
            {item.content && <Text style={styles.content}>{item.content}</Text>}
          </>
        )}
      />
      <View style={styles.emptyView} />
      <Toast config={toastConfig} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingTop: pixelSizeVertical(4),
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
  loginButton: {
    backgroundColor: "#07BEB8",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginBottom: pixelSizeVertical(24),
    width: "100%",
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#0C111F",
    textAlign: "center",
  },
});
