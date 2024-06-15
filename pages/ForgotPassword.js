import auth from "@react-native-firebase/auth";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

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
    const errors = { ...errors };

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
      <CustomTextInput
        placeholder="Email"
        value={email}
        editable={!loading}
        onChangeText={(email) => setEmail(email)}
      />
      {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

      <PrimaryButton loading={loading} onPress={handleSubmit} text="send" />
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
  text: {
    color: "#fff",
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
