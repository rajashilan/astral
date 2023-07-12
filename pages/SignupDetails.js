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
import dayjs from "dayjs";
import { firebase } from "../src/firebase/config";
import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import IosHeight from "../components/IosHeight";

export default function SignupDetails({ navigation, route }) {
  const { college, campus, department, intake, suffix } = route.params;

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
  const usernameRegex = /^([a-z0-9]|[_](?![_])){6,18}$/;
  const emailRegex =
    /^(?![\w\.@]*\.\.)(?![\w\.@]*\.@)(?![\w\.]*@\.)\w+[\w\.]*@[\w\.]+\.\w{2,}$/;

  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    let errors = [...errors];
    if (!email.trim()) errors.email = "Please enter your email address";
    else if (email && !email.match(emailRegex))
      errors.email = "Please enter a valid email address";
    else if (email.split("@")[1] !== suffix)
      errors.email = "Invalid student email";

    if (!name.trim()) errors.name = "Please enter your name";
    if (!username.trim()) errors.username = "Please enter your username";
    else if (username && !username.match(usernameRegex))
      errors.username =
        "Username should be in lowercase, within 6-18 characters, and must contain at least 1 letter. Special character '_' is allowed one at a time.";

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

      //first check for email
      firebase
        .firestore()
        .collection("users")
        .where("email", "==", email.toLowerCase())
        .get()
        .then((data) => {
          if (!data.empty) {
            errors.email = "Account already exists";
            setLoading(false);
          } else {
            //then check for username
            firebase
              .firestore()
              .collection("users")
              .where("username", "==", username)
              .get()
              .then((data) => {
                if (!data.empty) {
                  errors.username = "Username already exists";
                  setLoading(false);
                } else {
                  //if both email and username is cleared, then register user
                  const data = {
                    email: email.trim().toLowerCase(),
                    name: name,
                    username: username,
                    gender: selectedGender,
                    birthday: birthday,
                    profileImgUrl: "",
                    bio: "",
                    userId: "",
                    college: college,
                    department: department,
                    campus: campus,
                    intake: intake,
                    createdAt: new Date(),
                  };

                  firebase
                    .auth()
                    .createUserWithEmailAndPassword(data.email, password)
                    .then((res) => {
                      data.userId = res.user.uid;

                      res.user
                        .sendEmailVerification()
                        .then(() => {
                          firebase
                            .firestore()
                            .collection("users")
                            .doc(data.userId)
                            .set(data)
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
                              console.error(error);
                            });
                        })
                        .catch((error) => {
                          setLoading(false);
                          Toast.show({
                            type: "error",
                            text1: "Something went wrong",
                          });
                          console.error(error);
                        });
                    })
                    .catch((error) => {
                      setLoading(false);
                      Toast.show({
                        type: "error",
                        text1: "Something went wrong",
                      });
                      console.error(error);
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

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [birthday, setBirthday] = useState("");
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

  const onChange = (event, selectedDate) => {
    if (
      event.type === "dismissed" ||
      event.type === "neutralButtonPressed" ||
      event.type === "set"
    )
      setShowDatePicker(!showDatePicker);

    const birthday = dayjs(selectedDate);
    const now = dayjs(new Date());

    let errors = [...errors];

    if (now.diff(birthday, "year") < 16) {
      errors.birthday =
        "You have to be at least 16 years old to use this application.";
    } else {
      setBirthday(dayjs(selectedDate).format("D MMM YYYY"));
      errors.birthday = undefined;
    }
    setErrors(errors);
  };

  return (
    <View style={styles.container}>
      <IosHeight />
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
      <Text style={styles.title}>Now for your details</Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        <TextInput
          style={styles.textInput}
          placeholder="Student Email"
          placeholderTextColor="#DBDBDB"
          value={email}
          onChangeText={(email) => setEmail(email)}
          editable={!loading}
        />
        {errors.email ? <Text style={styles.error}>{errors.email}</Text> : null}

        <TextInput
          style={styles.textInput}
          placeholder="Name"
          placeholderTextColor="#DBDBDB"
          value={name}
          onChangeText={(name) => setName(name)}
          editable={!loading}
        />
        {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}

        <TextInput
          style={styles.textInput}
          placeholder="Username"
          placeholderTextColor="#DBDBDB"
          value={username}
          editable={!loading}
          onChangeText={(username) => setUsername(username)}
        />
        {errors.username ? (
          <Text style={styles.error}>{errors.username}</Text>
        ) : null}

        <SelectDropdown
          defaultButtonText={"Gender"}
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
              color: "#DFE5F8",
              textAlign: "left",
            }}
          >
            {birthday ? birthday.toString() : "Birthday"}
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
            value={password}
            editable={!loading}
            onChangeText={(password) => setPassword(password)}
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
          Your password should have no spaces, be between 8-16 characters, have
          at least 1 capital letter, 1 digit, and 1 special character.
        </Text>
        {errors.password ? (
          <Text style={styles.errorUnderDislcaimer}>{errors.password}</Text>
        ) : null}

        <Pressable
          style={loading ? styles.loginButtonDisabled : styles.loginButton}
          onPress={handleNext}
          disabled={loading}
        >
          <Text
            style={
              loading ? styles.loginButtonLoadingText : styles.loginButtonText
            }
          >
            {loading ? "signing you up..." : "next"}
          </Text>
        </Pressable>

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
        {!loading ? (
          <Pressable onPress={() => navigation.replace("Signup")}>
            <Text style={styles.tertiaryButton}>back</Text>
          </Pressable>
        ) : null}
        <View style={styles.emptyView}></View>
      </ScrollView>
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
  error: {
    marginTop: pixelSizeVertical(8),
    marginBottom: pixelSizeVertical(8),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#a3222d",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  errorUnderDislcaimer: {
    marginTop: pixelSizeVertical(-4),
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
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(30),
    backgroundColor: "#0C111F",
  },
});
