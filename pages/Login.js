import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import rocketBg from "../assets/rocket_background.png";
import { Image } from "expo-image";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { CommonActions } from "@react-navigation/native";

import IosHeight from "../components/IosHeight";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import { firebase } from "../src/firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { LOGOUT } from "../src/redux/type";
import { getAuthenticatedUser } from "../src/redux/actions/userActions";

export default function Login({ navigation, route }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: undefined,
    password: undefined,
    general: undefined,
  });

  const emailRegex =
    /^(?![\w\.@]*\.\.)(?![\w\.@]*\.@)(?![\w\.]*@\.)\w+[\w\.]*@[\w\.]+\.\w{2,}$/;

  const handleLogin = () => {
    let errors = [...errors];

    if (!email.trim()) errors.email = "Please enter your email address";
    else if (email.trim() && !email.trim().match(emailRegex))
      errors.email = "Please enter a valid email address";

    if (!password.trim()) errors.password = "Please enter your password";

    if (!errors.email && !errors.password) {
      setLoading(true);

      firebase
        .auth()
        .signInWithEmailAndPassword(email.trim().toLowerCase(), password)
        .then((authUser) => {
          // if (authUser.user.emailVerified) {
          // } else {
          //   Toast.show({
          //     type: "neutral",
          //     text1:
          //       "Oops, please verify your email to complete your registration!",
          //   });
          // }
          dispatch(getAuthenticatedUser(authUser.email));
          navigation.dispatch((state) => {
            return CommonActions.reset({
              index: 0,
              routes: [{ name: "Home" }],
            });
          });
          setLoading(false);
        })
        .catch(function (error) {
          console.error(error);
          errors.general = "Invalid user credentials. Please try again.";
          setLoading(false);
        });
    }

    setErrors(errors);
  };

  const handleSignup = () => {
    navigation.replace("Signup");
  };

  // useEffect(() => {
  //   const usersRef = firebase.firestore().collection("users");
  //   firebase.auth().onAuthStateChanged((user) => {
  //     if (user) {
  //       Toast.show({
  //         type: "success",
  //         text1: user.emailVerified,
  //       });
  //     } else {
  //       Toast.show({
  //         type: "error",
  //         text1: "Not logged in",
  //       });
  //     }
  //   });
  // }, []);

  let loginInputs = (
    <>
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        placeholderTextColor="#DBDBDB"
        value={email}
        editable={!loading}
        onChangeText={(email) => setEmail(email)}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <TextInput
        style={styles.textInput}
        placeholder="Password"
        secureTextEntry={true}
        placeholderTextColor="#DBDBDB"
        value={password}
        editable={!loading}
        onChangeText={(password) => setPassword(password)}
      />
      {errors.password ? (
        <Text style={styles.error}>{errors.password}</Text>
      ) : null}
      <Pressable
        style={loading ? styles.loginButtonDisabled : styles.loginButton}
        onPress={handleLogin}
      >
        <Text
          style={
            loading ? styles.loginButtonLoadingText : styles.loginButtonText
          }
        >
          {loading ? "logging you in..." : "login"}
        </Text>
      </Pressable>
      {errors.general ? (
        <Text style={styles.errorUnderButton}>{errors.general}</Text>
      ) : null}

      <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgotPasswordButton}>forgot password?</Text>
      </Pressable>

      <Pressable onPress={handleSignup}>
        <Text style={styles.secondaryButton}>signup instead</Text>
      </Pressable>
    </>
  );

  let loginDisplay = route.params?.signedUp ? (
    <ImageBackground
      source={rocketBg}
      style={styles.imageBackground}
      transition={3000}
    >
      <IosHeight />
      <Image
        style={styles.image}
        source={logo}
        contentFit="cover"
        transition={1000}
      />
      <Text style={styles.welcomeTitle}>
        Wohoo! Welcome to astral! &#128075;
      </Text>
      <Text style={styles.welcomeSubheading}>
        You’re one step away from convenience! We have sent you a verification
        email. Please click on the link to complete your registration, and
        you'll be off!
      </Text>
      {loginInputs}
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </ImageBackground>
  ) : (
    <View style={styles.container}>
      <IosHeight />
      <Image
        style={styles.image}
        source={logo}
        contentFit="cover"
        transition={1000}
      />
      {loginInputs}
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );

  return <>{loginDisplay}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  imageBackground: {
    flex: 1,
    backgroundColor: "#0C111F",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    backgroundColor: "#0C111F",
  },
  image: {
    width: widthPixel(177),
    height: heightPixel(93),
    marginBottom: pixelSizeVertical(38),
  },
  text: {
    color: "#fff",
  },
  textInput: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    marginTop: pixelSizeVertical(10),
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    width: "100%",
    borderRadius: 5,
  },
  loginButton: {
    backgroundColor: "#07BEB8",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(24),
    width: "100%",
    borderRadius: 5,
  },
  loginButtonDisabled: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(16),
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
  loginButtonLoadingText: {
    fontSize: fontPixel(22),
    fontWeight: "400",
    color: "#DFE5F8",
    textAlign: "center",
  },
  secondaryButton: {
    color: "#C4FFF9",
    fontSize: fontPixel(18),
    textTransform: "lowercase",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  forgotPasswordButton: {
    color: "#C4FFF9",
    fontSize: fontPixel(14),
    textTransform: "lowercase",
    fontWeight: "400",
    marginBottom: pixelSizeVertical(34),
  },
  welcomeTitle: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    textAlign: "center",
    marginTop: pixelSizeVertical(-26),
    marginBottom: pixelSizeVertical(4),
  },
  welcomeSubheading: {
    fontSize: fontPixel(14),
    fontWeight: "500",
    color: "#C6CDE2",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: pixelSizeVertical(16),
  },
  error: {
    marginTop: pixelSizeVertical(8),
    marginBottom: pixelSizeVertical(8),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#a3222d",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  errorUnderButton: {
    marginTop: pixelSizeVertical(-12),
    marginBottom: pixelSizeVertical(16),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#a3222d",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    textAlign: "center",
  },
});
