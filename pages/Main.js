import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { Image } from "expo-image";
import Carousel, { Pagination } from "react-native-snap-carousel";
const { width } = Dimensions.get("window");

import IosHeight from "../components/IosHeight";

import welcome from "../assets/welcome.png";
import orientation from "../assets/orientation.png";
import clubs from "../assets/clubs.png";
import departments from "../assets/departments.png";
import lecturers from "../assets/lecturers.png";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { TouchableWithoutFeedback } from "react-native-web";

import { firebase } from "../src/firebase/config";

import { useDispatch, useSelector } from "react-redux";
import { getAuthenticatedUser } from "../src/redux/actions/userActions";

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
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        //get user details
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

  const [email, setEmail] = useState("");
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
        <Image
          style={styles.image}
          source={logo}
          contentFit="contain"
          transition={1000}
        />
        <View>
          <Carousel
            layout="default"
            data={data}
            disableIntervalMomentum={true}
            onSnapToItem={(index) => onSelect(index)}
            sliderWidth={width - 32}
            itemWidth={width - 32}
            useExperimentalSnap={true}
            renderItem={({ item, index }) => (
              <>
                <Image
                  key={index}
                  style={styles.displayImage}
                  contentFit="contain"
                  source={item.image}
                  transition={1000}
                />
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.content}>{item.subtitle}</Text>
              </>
            )}
          />
          <Pagination
            inactiveDotColor="#546593"
            dotColor={"#C4FFF9"}
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
          <Pressable style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>login</Text>
          </Pressable>
          <Pressable style={styles.signupButton} onPress={handleSignup}>
            <Text style={styles.loginButtonText}>signup</Text>
          </Pressable>
          <StatusBar
            style="light"
            translucent={false}
            backgroundColor="#0C111F"
          />
        </View>
        <View style={styles.emptyView}></View>
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
  loginButton: {
    backgroundColor: "#07BEB8",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginBottom: pixelSizeVertical(16),
    width: "100%",
    borderRadius: 5,
  },
  signupButton: {
    backgroundColor: "#C4FFF9",
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
  secondaryButton: {
    color: "#07BEB8",
    fontSize: fontPixel(18),
    textTransform: "lowercase",
    fontWeight: 500,
    textDecorationLine: "underline",
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
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(30),
    backgroundColor: "#0C111F",
  },
});
