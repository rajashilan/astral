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

import IosHeight from "../components/IosHeight";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import auth from "@react-native-firebase/auth";

export default function ForgotPassword({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: undefined,
    general: undefined,
  });

  const emailRegex =
    /^(?![\w\.@]*\.\.)(?![\w\.@]*\.@)(?![\w\.]*@\.)\w+[\w\.]*@[\w\.]+\.\w{2,}$/;

  const handleSubmit = () => {
    let errors = [...errors];

    if (!email.trim()) errors.email = "Please enter your email address";
    else if (email && !email.match(emailRegex))
      errors.email = "Please enter a valid email address";

    if (!errors.email) {
      setLoading(true);
      auth()
        .sendPasswordResetEmail(email.trim().toLowerCase())
        .then(() => {
          setLoading(false);
          Toast.show({
            type: "success",
            text1: "Email sent successfully!",
          });
        })
        .catch((error) => {
          if (error.code === "auth/user-not-found")
            errors.general = "Please enter a registered email address";
          else
            Toast.show({
              type: "error",
              text1: "Something went wrong",
            });
          setLoading(false);
        });
    }

    setErrors(errors);
  };

  return (
    <View style={styles.container}>
      <IosHeight />
      <Text style={styles.title}>Forgot your password?</Text>
      <Text style={styles.content}>
        No worries! We'll send you an email where you can reset your password.
      </Text>
      <TextInput
        style={styles.textInput}
        placeholder="Email"
        placeholderTextColor="#DBDBDB"
        value={email}
        editable={!loading}
        onChangeText={(email) => setEmail(email)}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <Pressable
        style={loading ? styles.loginButtonDisabled : styles.loginButton}
        onPress={handleSubmit}
      >
        <Text
          style={
            loading ? styles.loginButtonLoadingText : styles.loginButtonText
          }
        >
          {loading ? "sending..." : "send"}
        </Text>
      </Pressable>
      {errors.general ? (
        <Text style={styles.errorUnderButton}>{errors.general}</Text>
      ) : null}

      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={styles.tertiaryButton}>back</Text>
      </Pressable>
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );
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
    fontWeight: 500,
    textDecorationLine: "underline",
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
  tertiaryButton: {
    color: "#A7AFC7",
    fontSize: fontPixel(22),
    textTransform: "lowercase",
    fontWeight: "400",
    textAlign: "center",
  },
  title: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginTop: pixelSizeVertical(18),
    marginBottom: pixelSizeVertical(6),
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
