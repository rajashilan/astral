import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Image } from "expo-image";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import SelectDropdown from "react-native-select-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import passwordShow from "../assets/password_show.png";
import passwordHide from "../assets/password_hide.png";

export default function SignupDetails({ navigation }) {
  const handleNext = () => {
    navigation.replace("SignupExtra");
  };

  const [email, setEmail] = useState("");

  const [gender] = useState(["Male", "Female", "Rather not say"]);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passwordInvisible, setPasswordInvisibile] = useState(true);

  const onChange = (event, selectedDate) => {
    setDate(selectedDate);
    setShowDatePicker(!showDatePicker);
    console.log(selectedDate);
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={logo}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.progressContainer}>
        <View style={styles.progressInactive} />
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
      </View>
      <Text style={styles.title}>Now for your details.</Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Campus Email"
          placeholderTextColor="#DBDBDB"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Name"
          placeholderTextColor="#DBDBDB"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          placeholderTextColor="#DBDBDB"
        />
        <SelectDropdown
          defaultButtonText={"Gender"}
          buttonStyle={{
            backgroundColor: "#1A2238",
            marginTop: pixelSizeVertical(10),
            height: heightPixel(58),
            width: "100%",
            borderRadius: 5,
          }}
          buttonTextStyle={{
            fontSize: fontPixel(16),
            fontWeight: "400",
            color: "#DFE5F8",
            textAlign: "left",
          }}
          dropdownStyle={{
            backgroundColor: "#1A2238",
            borderRadius: 5,
          }}
          rowStyle={{
            backgroundColor: "#1A2238",
            borderBottomWidth: 0,
          }}
          rowTextStyle={{
            fontSize: fontPixel(16),
            fontWeight: "400",
            color: "#DFE5F8",
            textAlign: "left",
          }}
          selectedRowStyle={{
            backgroundColor: "#C4FFF9",
          }}
          selectedRowTextStyle={{
            color: "#0C111F",
            fontSize: fontPixel(16),
            fontWeight: "400",
            textAlign: "left",
          }}
          data={gender}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
          }}
        />
        <Pressable
          onPress={() => setShowDatePicker(!showDatePicker)}
          style={{
            backgroundColor: "#1A2238",
            marginTop: pixelSizeVertical(10),
            height: heightPixel(58),
            width: "100%",
            borderRadius: 5,
            paddingRight: pixelSizeHorizontal(16),
            paddingLeft: pixelSizeHorizontal(16),
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: fontPixel(16),
              fontWeight: "400",
              color: "#DFE5F8",
              textAlign: "left",
            }}
          >
            Birthday
          </Text>
        </Pressable>
        <Text style={styles.disclaimer}>
          Your gender and birthday will not be shared with others.
        </Text>

        {showDatePicker && (
          <DateTimePicker
            mode="date"
            value={new Date()}
            display="spinner"
            maximumDate={new Date(2012, 11, 25)}
            onChange={onChange}
          />
        )}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#DBDBDB"
            secureTextEntry={passwordInvisible}
          />
          <Pressable
            onPress={() => setPasswordInvisibile(!passwordInvisible)}
            hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
          >
            <Image
              style={styles.passwordIcon}
              source={passwordInvisible ? passwordShow : passwordHide}
              contentFit="contain"
            />
          </Pressable>
        </View>
        <Text style={styles.disclaimer}>
          Your password should be between 8-16 characters, have at least 1
          capital letter, 1 digit, and 1 special character.
        </Text>

        <Pressable style={styles.loginButton} onPress={handleNext}>
          <Text style={styles.loginButtonText}>next</Text>
        </Pressable>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: pixelSizeVertical(24),
          }}
        >
          <Text style={styles.disclaimerNoMargin}>
            By registering, you agree to our
          </Text>
          <Pressable>
            <Text style={styles.disclaimerLink}>Terms of Service</Text>
          </Pressable>
          <Text style={styles.disclaimerNoMargin}>
            and you acknowledge you have read our
          </Text>
          <Pressable>
            <Text style={styles.disclaimerLink}>Privacy Policy</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.replace("Main")}>
          <Text style={styles.tertiaryButton}>back</Text>
        </Pressable>
        <StatusBar
          style="light"
          translucent={false}
          backgroundColor="#0C111F"
        />
        <View style={styles.emptyView}></View>
      </ScrollView>
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
  image: {
    width: widthPixel(177),
    height: heightPixel(93),
    marginTop: pixelSizeVertical(80),
    marginBottom: pixelSizeVertical(24),
  },
  title: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(12),
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
  disclaimer: {
    marginTop: pixelSizeVertical(8),
    marginBottom: pixelSizeVertical(8),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#A7AFC7",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  disclaimerNoMargin: {
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#A7AFC7",
    marginRight: pixelSizeHorizontal(4),
  },
  disclaimerLink: {
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#07BEB8",
    marginRight: pixelSizeHorizontal(4),
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
  loginButtonText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#0C111F",
    textAlign: "center",
  },
  tertiaryButton: {
    color: "#A7AFC7",
    fontSize: fontPixel(22),
    textTransform: "lowercase",
    fontWeight: "400",
    textAlign: "center",
  },
  progressContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: pixelSizeVertical(24),
  },
  progressActive: {
    display: "flex",
    width: pixelSizeHorizontal(44),
    height: pixelSizeVertical(16),
    backgroundColor: "#C4FFF9",
    borderRadius: 5,
    marginLeft: pixelSizeHorizontal(4),
    marginRight: pixelSizeHorizontal(4),
  },
  progressInactive: {
    display: "flex",
    width: pixelSizeHorizontal(44),
    height: pixelSizeVertical(16),
    backgroundColor: "#232D4A",
    borderRadius: 5,
    marginLeft: pixelSizeHorizontal(4),
    marginRight: pixelSizeHorizontal(4),
  },
  passwordIcon: {
    width: widthPixel(21),
    height: heightPixel(17),
  },
  passwordContainer: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    marginTop: pixelSizeVertical(10),
    width: "100%",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  passwordInput: {
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    width: "86%",
    marginRight: pixelSizeHorizontal(8),
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(30),
    backgroundColor: "#0C111F",
  },
});
