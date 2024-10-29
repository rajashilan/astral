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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import EmptyView from "../components/EmptyView";

export default function Login({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: undefined,
    password: undefined,
    general: undefined,
  });
  const [emailNotVerified, setEmailNotVerified] = useState(false);

  const emailRegex =
    /^(?![\w\.@]*\.\.)(?![\w\.@]*\.@)(?![\w\.]*@\.)\w+[\w\.]*@[\w\.]+\.\w{2,}$/;

  const handleLogin = () => {
    if (emailNotVerified) setEmailNotVerified(false);

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
          if (authUser.user.emailVerified) {
            navigation.dispatch((state) => {
              return CommonActions.reset({
                index: 0,
                routes: [{ name: "Home" }],
              });
            });
          } else {
            Toast.show({
              type: "neutral",
              text1:
                "Oops, please verify your email to complete your registration!",
            });
            setEmailNotVerified(true);
            setLoading(false);
            return;
          }
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

  const resendVerificationLink = () => {
    setLoading(true);

    const user = auth().currentUser; // Get the current user directly

    if (user) {
      user
        .sendEmailVerification()
        .then(() => {
          setLoading(false);
          Toast.show({
            type: "success",
            text1: "Verification link sent successfully.",
          });
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
        });
    } else {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "No user is currently logged in.",
      });
    }
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

      {emailNotVerified ? (
        <Pressable disabled={loading} onPress={resendVerificationLink}>
          <Text style={styles.resetVerificationLinkButton}>
            {!loading ? "resend verification link" : "sending..."}
          </Text>
        </Pressable>
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: pixelSizeVertical(60),
      }}
    >
      <ScrollView>
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
            You’re only one step away! We have sent you a verification email.
            Please click on the link to complete your registration, and you'll
            be off!
          </Text>
          {loginInputs}
          <Toast config={toastConfig} />
          <StatusBar
            style="light"
            translucent={false}
            backgroundColor="#0C111F"
          />
        </ImageBackground>
        <EmptyView />
      </ScrollView>
    </KeyboardAvoidingView>
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: pixelSizeVertical(60),
      }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <IosHeight />

        <FastImage
          style={styles.image}
          source={logo}
          resizeMode="contain"
          transition={1000}
        />
        {loginInputs}

        <Toast config={toastConfig} />
        <StatusBar
          style="light"
          translucent={false}
          backgroundColor="#0C111F"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return <>{loginDisplay}</>;
}

const styles = StyleSheet.create({
  container: {
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
  resetVerificationLinkButton: {
    color: "#C4FFF9",
    fontSize: fontPixel(16),
    textTransform: "lowercase",
    fontWeight: "400",
    marginBottom: pixelSizeVertical(34),
    paddingVertical: pixelSizeVertical(8),
    paddingHorizontal: pixelSizeHorizontal(16),
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#C4FFF9",
    borderRadius: 5,
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
