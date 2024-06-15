import auth from "@react-native-firebase/auth";
import { CommonActions } from "@react-navigation/native";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ImageBackground,
} from "react-native";
import Toast from "react-native-toast-message";

import logo from "../assets/logo.png";
import rocketBg from "../assets/rocket_background.png";
import IosHeight from "../components/IosHeight";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";
import CustomTextInput from "../components/CustomTextInput";

export default function Login({ navigation, route }) {
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
    const errors = { ...errors };

    if (!email.trim()) errors.email = "Please enter your email address";
    else if (email.trim() && !email.trim().match(emailRegex))
      errors.email = "Please enter a valid email address";

    if (!password.trim()) errors.password = "Please enter your password";

    if (!errors.email && !errors.password) {
      setLoading(true);

      auth()
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
          //dispatch(getAuthenticatedUser(authUser.email));
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

  const loginInputs = (
    <>
      <CustomTextInput
        placeholder="Email"
        label="email"
        value={email}
        editable={!loading}
        onChangeText={(email) => setEmail(email)}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}
      <CustomTextInput
        placeholder="Password"
        label="password"
        secureTextEntry={true}
        value={password}
        editable={!loading}
        onChangeText={(password) => setPassword(password)}
      />
      {errors.password ? (
        <Text style={styles.error}>{errors.password}</Text>
      ) : null}
      <PrimaryButton loading={loading} onPress={handleLogin} text="login" />
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

  const loginDisplay = route.params?.signedUp ? (
    <ImageBackground
      source={rocketBg}
      style={styles.imageBackground}
      transition={3000}
    >
      <IosHeight />
      <FastImage
        style={styles.image}
        source={logo}
        resizeMode="contain"
        transition={1000}
      />
      <Text style={styles.welcomeTitle}>
        Wohoo! Welcome to astral! &#128075;
      </Text>
      <Text style={styles.welcomeSubheading}>
        You’re only one step away! We have sent you a verification email. Please
        click on the link to complete your registration, and you'll be off!
      </Text>
      {loginInputs}
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </ImageBackground>
  ) : (
    <View style={styles.container}>
      <IosHeight />
      <FastImage
        style={styles.image}
        source={logo}
        resizeMode="contain"
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
  },
  image: {
    width: widthPixel(177),
    height: heightPixel(93),
    marginBottom: pixelSizeVertical(38),
  },
  text: {
    color: "#fff",
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
    color: "#ed3444",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  errorUnderButton: {
    marginTop: pixelSizeVertical(-12),
    marginBottom: pixelSizeVertical(16),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#ed3444",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    textAlign: "center",
  },
});
