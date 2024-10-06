import DateTimePicker from "@react-native-community/datetimepicker";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import dayjs from "dayjs";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Toast from "react-native-toast-message";

import logo from "../assets/logo.png";
import passwordHide from "../assets/password_hide.png";
import passwordShow from "../assets/password_show.png";
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
import EmptyView from "../components/EmptyView";
import CustomTextInput from "../components/CustomTextInput";
import * as WebBrowser from "expo-web-browser";

const db = firestore();

export default function SignupDetails({ navigation, route }) {
  const { college, campus, department, intake, suffix } = route.params;

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
  const usernameRegex = /^([A-Za-z0-9]|[_](?![_])){6,18}$/;
  const emailRegex =
    /^(?![\w\.@]*\.\.)(?![\w\.@]*\.@)(?![\w\.]*@\.)\w+[\w\.]*@[\w\.]+\.\w{2,}$/;

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [birthdayToShow, setBirthdayToShow] = useState(undefined);
  const [password, setPassword] = useState("");

  const [gender] = useState(["Male", "Female", "Rather not say"]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [passwordInvisible, setPasswordInvisibile] = useState(true);

  const [errors, setErrors] = useState({
    email: undefined,
    name: undefined,
    username: undefined,
    gender: undefined,
    birthday: undefined,
    password: undefined,
  });

  const capitalize = (string) => {
    return [...string.slice(0, 1).toUpperCase(), ...string.slice(1)].join("");
  };

  const TERMS_AND_CONDITION =
    "https://medium.com/@astral-app/astral-terms-and-conditions-4aa4b212a074";
  const PRIVACY_POLICY =
    "https://medium.com/@astral-app/astral-privacy-policy-a8908d091ed6";

  const handleNext = () => {
    const errors = { ...errors };
    if (!email.trim()) errors.email = "Please enter your email address";
    else if (email && !email.match(emailRegex))
      errors.email = "Please enter a valid email address";
    else if (email.split("@")[1] !== suffix)
      errors.email = "Invalid student email";

    if (!name.trim()) errors.name = "Please enter your name";
    if (!username.trim()) errors.username = "Please enter your username";
    else if (username && !username.match(usernameRegex))
      errors.username =
        "Username should be within 6-18 characters, and must contain at least 1 letter. Special character '_' is allowed one at a time.";

    if (!selectedGender) errors.gender = "Please select";
    if (!birthday) errors.birthday = "Please enter your birthday";
    if (!password.trim()) errors.password = "Please enter your password";
    else if (password && !password.match(passwordRegex))
      errors.password = "Please enter a valid password";

    if (
      !errors.email &&
      !errors.name &&
      !errors.username &&
      !errors.gender &&
      !errors.birthday &&
      !errors.password
    ) {
      setLoading(true);

      // check for username
      db.collection("usernames")
        .where("username", "==", username.toLowerCase())
        .get()
        .then((data) => {
          if (!data.empty) {
            errors.username = "Username already exists";
            Toast.show({
              type: "error",
              text1: "Username already exists",
            });
            setLoading(false);
          } else {
            // if both email and username is cleared, then register user
            const data = {
              email: email.trim().toLowerCase(),
              name: capitalize(name),
              isFirstTime: true,
              username: username.trim().toLowerCase(),
              gender: selectedGender,
              birthday,
              profileImage:
                "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/users%2FprofileImage%2Fuser_default_img.png?alt=media&token=6199cf2b-cbfe-4b25-a3b4-ef6b5261e98b",
              bio: "",
              userId: "",
              college,
              department,
              campus,
              intake,
              clubs: [],
              phone_number: "",
              createdAt: new Date(),
            };

            auth()
              .createUserWithEmailAndPassword(data.email, password)
              .then((res) => {
                data.userId = res.user.uid;

                res.user
                  .sendEmailVerification()
                  .then(() => {
                    db.collection("users")
                      .doc(data.userId)
                      .set(data)
                      .then(() => {
                        return db
                          .collection("usernames")
                          .add({ username: username.trim().toLowerCase() });
                      })
                      .then(() => {
                        setLoading(false);
                        navigation.replace("Login", {
                          signedUp: true,
                        });
                      })
                      .catch((error) => {
                        setLoading(false);
                        Toast.show({
                          type: "error",
                          text1: "Something went wrong",
                        });
                        console.error("error: ", error);
                      });
                  })
                  .catch((error) => {
                    setLoading(false);
                    Toast.show({
                      type: "error",
                      text1: "Something went wrong",
                    });
                    console.error("error: ", error);
                  });
              })
              .catch((error) => {
                console.error("error: ", error.code);
                setLoading(false);
                if (error.code === "auth/email-already-in-use") {
                  errors.email = "Email is already in use";
                  Toast.show({
                    type: "error",
                    text1: "Email is already in use",
                  });
                } else {
                  Toast.show({
                    type: "error",
                    text1: "Something went wrong",
                  });
                }
              });
          }
        })
        .catch((error) => {
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
          console.error(error);
        });
    }
    setErrors(errors);
  };

  const onChange = (event, selectedDate) => {
    if (
      event.type === "dismissed" ||
      event.type === "neutralButtonPressed" ||
      event.type === "set"
    )
      setShowDatePicker(!showDatePicker);

    const getBirthday = dayjs(selectedDate);
    const now = dayjs(new Date());
    setBirthdayToShow(new Date(getBirthday.toString()));
    const errors = { ...errors };

    if (now.diff(getBirthday, "year") < 17) {
      errors.birthday =
        "You have to be at least 16 years old to use this application.";
    } else {
      setBirthday(dayjs(selectedDate).format("D MMM YYYY"));
      errors.birthday = undefined;
    }
    setErrors(errors);
  };

  const handleOnPress = (item) => {
    WebBrowser.openBrowserAsync(item.link);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
      style={styles.container}
    >
      <IosHeight />
      <FastImage
        style={styles.image}
        source={logo}
        resizeMode="contain"
        transition={1000}
      />
      <View style={styles.progressContainer}>
        <View style={styles.progressInactive} />
        <View style={styles.progressActive} />
      </View>
      <Text style={styles.title}>Now for your details</Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        <CustomTextInput
          placeholder="enter your student email"
          label="student email"
          value={email}
          onChangeText={(email) => setEmail(email)}
          editable={!loading}
        />
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

        <CustomTextInput
          placeholder="enter your name"
          label="name"
          value={name}
          onChangeText={(name) => setName(name)}
          editable={!loading}
        />
        {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

        <CustomTextInput
          placeholder="enter your username"
          label="username"
          value={username}
          editable={!loading}
          onChangeText={(username) => setUsername(username)}
        />
        {errors.username ? (
          <Text style={styles.error}>{errors.username}</Text>
        ) : null}

        <CustomTextInput
          placeholder="enter your phone number (optional)"
          label="phone number"
          value={phoneNumber}
          editable={!loading}
          keyboardType="number-pad"
          onChangeText={(number) => setPhoneNumber(number)}
        />
        <Text style={styles.disclaimer}>
          Your contact details will only be shared with clubs that you join.
        </Text>

        <SelectDropdown
          defaultButtonText="gender"
          disabled={loading}
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
            color: "#A7AFC7",
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
            setSelectedGender(selectedItem);
          }}
        />
        {errors.gender ? (
          <Text style={styles.error}>{errors.gender}</Text>
        ) : null}

        <Pressable
          onPress={() => setShowDatePicker(!showDatePicker)}
          disabled={loading}
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
              color: "#A7AFC7",
              textAlign: "left",
            }}
          >
            {birthday ? birthday.toString() : "birthday"}
          </Text>
        </Pressable>
        <Text style={styles.disclaimer}>
          Your gender and birthday will not be shared with others.
        </Text>
        {errors.birthday ? (
          <Text style={styles.errorUnderDislcaimer}>{errors.birthday}</Text>
        ) : null}

        {showDatePicker && (
          <DateTimePicker
            mode="date"
            value={birthdayToShow ? birthdayToShow : new Date()}
            display="spinner"
            onChange={onChange}
            textColor="white"
          />
        )}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="enter your passsword"
            placeholderTextColor="#A7AFC7"
            secureTextEntry={passwordInvisible}
            value={password}
            editable={!loading}
            onChangeText={(password) => setPassword(password)}
          />
          <Pressable
            onPress={() => setPasswordInvisibile(!passwordInvisible)}
            hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
          >
            <FastImage
              style={styles.passwordIcon}
              source={passwordInvisible ? passwordShow : passwordHide}
              resizeMode="contain"
            />
          </Pressable>
        </View>
        <Text style={styles.disclaimer}>
          Your password should have no spaces, be between 8-16 characters, have
          at least 1 capital letter, 1 digit, and 1 special character.
        </Text>
        {errors.password ? (
          <Text style={styles.errorUnderDislcaimer}>{errors.password}</Text>
        ) : null}
        <PrimaryButton loading={loading} onPress={handleNext} text="sign up" />

        {errors.email ||
        errors.name ||
        errors.birthday ||
        errors.gender ||
        errors.password ||
        errors.username ? (
          <Text style={styles.errorUnderButton}>
            Please clear off the errors to continue.
          </Text>
        ) : null}
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
          <Pressable
            onPress={() => {
              handleOnPress({ link: TERMS_AND_CONDITION });
            }}
          >
            <Text style={styles.disclaimerLink}>Terms and Conditions</Text>
          </Pressable>
          <Text style={styles.disclaimerNoMargin}>
            and you acknowledge you have read our
          </Text>
          <Pressable
            onPress={() => {
              handleOnPress({ link: PRIVACY_POLICY });
            }}
          >
            <Text style={styles.disclaimerLink}>Privacy Policy</Text>
          </Pressable>
        </View>
        {!loading ? (
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={styles.tertiaryButton}>back</Text>
          </Pressable>
        ) : null}
        <EmptyView />
      </ScrollView>
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </KeyboardAvoidingView>
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
  disclaimer: {
    marginTop: pixelSizeVertical(8),
    marginBottom: pixelSizeVertical(8),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#A7AFC7",
    paddingLeft: pixelSizeHorizontal(12),
    paddingRight: pixelSizeHorizontal(12),
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
  error: {
    marginTop: pixelSizeVertical(8),
    marginBottom: pixelSizeVertical(8),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#ed3444",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  errorUnderDislcaimer: {
    marginTop: pixelSizeVertical(-4),
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
  progressContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: pixelSizeVertical(24),
  },
  progressActive: {
    display: "flex",
    width: pixelSizeHorizontal(50),
    height: pixelSizeVertical(16),
    backgroundColor: "#C4FFF9",
    borderRadius: 5,
    marginLeft: pixelSizeHorizontal(4),
    marginRight: pixelSizeHorizontal(4),
  },
  progressInactive: {
    display: "flex",
    width: pixelSizeHorizontal(50),
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
});
