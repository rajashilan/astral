import auth from "@react-native-firebase/auth";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useDispatch } from "react-redux";

import clubs from "../assets/clubs.png";
import departments from "../assets/departments.png";
import lecturers from "../assets/lecturers.png";
import logo from "../assets/logo.png";
import orientation from "../assets/orientation.png";
import welcome from "../assets/welcome.png";
import IosHeight from "../components/IosHeight";
import { getAuthenticatedUser } from "../src/redux/actions/userActions";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import PrimaryButton from "../components/PrimaryButton";
import EmptyView from "../components/EmptyView";

const { width } = Dimensions.get("window");

export default function Main({ navigation }) {
  const dispatch = useDispatch();

  const [data] = useState([
    {
      image: welcome,
      title: "Welcome to astral",
      subtitle: "Where we try and make your student life easier.",
    },
    {
      image: orientation,
      title: "Orientation made accessible",
      subtitle:
        "Kick-start by having all the important details you need right with you, hassle-free.",
    },
    {
      image: clubs,
      title: "Discover clubs you love",
      subtitle:
        "Have loads of fun experiences by joining clubs and meeting people who share the same interests!",
    },
    {
      image: departments,
      title: "Always stay updated",
      subtitle:
        "Quickly view announcements and save important files from your department. Good-bye FB groups.",
    },
    {
      image: lecturers,
      title: "Connect with your lecturers",
      subtitle:
        "Easily set up meetings with your lecturers using their contact and schedule details.",
    },
  ]);

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        //get user details
        console.log("FIX THE BUG BY USING user.emailVerified");
        dispatch(getAuthenticatedUser(user.email));
        navigation.replace("Home");
      }
    });
  }, []);

  const handleLogin = () => {
    navigation.replace("Login");
  };

  const handleSignup = () => {
    navigation.replace("Signup");
  };

  const [indexSelected, setIndexSelected] = useState(0);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  return (
    <View style={styles.container}>
      <IosHeight />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        <FastImage
          style={styles.image}
          source={logo}
          resizeMode="contain"
          transition={1000}
        />
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
                  style={styles.displayImage}
                  transition={1000}
                  resizeMode="contain"
                  source={item.image}
                  progressiveRenderingEnabled={true}
                  cache={FastImage.cacheControl.immutable}
                  priority={FastImage.priority.normal}
                />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.subtitle}</Text>
              </>
            )}
          />
          <Pagination
            inactiveDotColor="#546593"
            dotColor="#C4FFF9"
            activeDotIndex={indexSelected}
            containerStyle={{
              paddingTop: 0,
              paddingBottom: 0,
              marginBottom: pixelSizeVertical(28),
              alignSelf: "center",
            }}
            dotsLength={data.length}
            inactiveDotScale={1}
          />
          <PrimaryButton
            onPress={handleLogin}
            text="login"
            buttonStyle={{ marginBottom: pixelSizeVertical(16), marginTop: 0 }}
          />
          <PrimaryButton
            onPress={handleSignup}
            text="signup"
            buttonStyle={{ marginTop: 0, backgroundColor: "#C4FFF9" }}
          />
          <StatusBar
            style="light"
            translucent={false}
            backgroundColor="#0C111F"
          />
        </View>
        <EmptyView />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  image: {
    alignSelf: "center",
    width: widthPixel(175),
    height: heightPixel(92),
    marginTop: pixelSizeVertical(36),
  },
  text: {
    color: "#fff",
  },
  displayImage: {
    marginTop: pixelSizeVertical(26),
    alignSelf: "center",
    width: width - 32,
    height: heightPixel(262),
  },
  title: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginTop: pixelSizeVertical(18),
    marginBottom: pixelSizeVertical(2),
    textAlign: "center",
  },
  content: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#A7AFC7",
    marginBottom: pixelSizeVertical(20),
    textAlign: "center",
  },
});
