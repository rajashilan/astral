import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { Image } from "expo-image";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../../utils/responsive-font";
import { TouchableWithoutFeedback } from "react-native-web";

export default function Login({ navigation }) {
  const handleLogin = () => {
    navigation.replace("Home");
  };

  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={logo}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.span}>
        <Text style={styles.input}>&#x3e;</Text>
        <TextInput
          style={[
            styles.input,
            StyleSheet.create({
              paddingLeft: pixelSizeHorizontal(5),
              paddingRight: pixelSizeHorizontal(5),
            }),
          ]}
          placeholder="email"
          placeholderTextColor="#DBDBDB"
          value={email}
          onChange={(email) => setEmail(email)}
        />
      </View>
      <View style={styles.span}>
        <Text style={styles.input}>&#x3e;</Text>
        <TextInput
          style={[
            styles.input,
            StyleSheet.create({
              paddingLeft: pixelSizeHorizontal(5),
              paddingRight: pixelSizeHorizontal(5),
            }),
          ]}
          placeholder="password"
          secureTextEntry={true}
          placeholderTextColor="#DBDBDB"
        />
      </View>
      <Pressable onPress={handleLogin}>
        <View style={styles.onlySpan}>
          <Text style={styles.loginButton}>lo</Text>
          <Text style={styles.loginButtonNoUnderline}>g</Text>
          <Text style={styles.loginButton}>in</Text>
        </View>
      </Pressable>
      <TouchableWithoutFeedback>
        <Text style={styles.secondaryButton}>signup instead</Text>
      </TouchableWithoutFeedback>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: widthPixel(177),
    height: heightPixel(93),
    marginBottom: pixelSizeVertical(30),
  },
  text: {
    color: "#fff",
  },
  input: {
    fontSize: fontPixel(18),
    color: "#DBDBDB",
    fontWeight: 500,
  },
  span: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  onlySpan: {
    flexDirection: "row",
  },
  loginButton: {
    color: "#C4FFF9",
    fontSize: fontPixel(78),
    marginTop: pixelSizeVertical(20),
    textTransform: "lowercase",
    fontWeight: 700,
    textDecorationLine: "underline",
  },
  loginButtonNoUnderline: {
    color: "#C4FFF9",
    fontSize: fontPixel(78),
    marginTop: pixelSizeVertical(20),
    textTransform: "lowercase",
    fontWeight: 700,
  },
  secondaryButton: {
    color: "#07BEB8",
    fontSize: fontPixel(18),
    marginTop: pixelSizeVertical(30),
    textTransform: "lowercase",
    fontWeight: 500,
    textDecorationLine: "underline",
  },
});
