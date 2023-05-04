import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import logo from "../assets/logo.png";
import { Image } from "expo-image";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { TouchableWithoutFeedback } from "react-native-web";
import SelectDropdown from "react-native-select-dropdown";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { firebase } from "../src/firebase/config";

const db = firebase.firestore();

export default function Signup({ navigation }) {
  const handleNext = () => {
    navigation.replace("SignupDetails");
  };

  const handleLogin = () => {
    navigation.replace("Login");
  };

  const [email, setEmail] = useState("");

  const [colleges, setColleges] = useState(["INTI", "Disted"]);
  const [selectedCollege, setSelectedCollege] = useState("");

  const [campuses, setCampuses] = useState(["INTI Penang", "INTI Subang"]);
  const [selectedCampus, setSelectedCampus] = useState("");

  const [departments, setDepartments] = useState([
    "Computing",
    "Engineering",
    "Medical",
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [intakeMonths, setIntakeMonths] = useState([
    "Jun 2020",
    "Aug 2020",
    "Dec 2020",
  ]);
  const [intakeYears] = useState([
    2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  ]);
  const [selectedIntakeMonth, setSelectedIntakeMonth] = useState("");
  const [selectedIntakeYear, setSelectedIntakeYear] = useState(0);

  const departmentDropDownRef = useRef({});
  const campusDropDownRef = useRef({});

  const resetAllForCollege = () => {
    setSelectedCampus("");
    setSelectedDepartment("");
    setSelectedIntakeMonth("");
    setSelectedIntakeYear(0);
    if (selectedCollege) campusDropDownRef.current.reset();
  };

  const resetAllForCampus = () => {
    setSelectedDepartment("");
    setSelectedIntakeMonth("");
    setSelectedIntakeYear(0);
    if (selectedCampus) departmentDropDownRef.current.reset();
  };

  useEffect(() => {
    db.collection("colleges")
      .get()
      .then((data) => {
        let colleges = [];
        data.forEach((doc) => {
          colleges.push(doc.data().name);
        });
        setColleges(colleges);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    resetAllForCollege();

    db.collection("campuses")
      .where("college", "==", selectedCollege)
      .get()
      .then((data) => {
        let campuses = [];
        data.forEach((doc) => {
          campuses.push(doc.data().name);
        });
        setCampuses(campuses);
      });
  }, [selectedCollege]);

  useEffect(() => {
    resetAllForCampus();

    db.collection("campuses")
      .where("name", "==", selectedCampus)
      .get()
      .then((data) => {
        let departments = [];
        let intakes = [];

        data.forEach((doc) => {
          doc.data().departments.forEach((department) => {
            departments.push(department);
          });
          doc.data().intakes.forEach((intake) => {
            intakes.push(intake);
          });
        });

        setDepartments(departments);
        setIntakeMonths(intakes);
      });
  }, [selectedCampus]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={logo}
        contentFit="cover"
        transition={1000}
      />
      <View style={styles.progressContainer}>
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />
      </View>
      <Text style={styles.title}>Let's start with your campus</Text>
      <SelectDropdown
        search={true}
        searchInputStyle={{
          backgroundColor: "#232D4A",
        }}
        searchPlaceHolder="Search colleges..."
        searchInputTxtColor="#DFE5F8"
        defaultButtonText={"Select your college"}
        showsVerticalScrollIndicator={true}
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
        data={colleges}
        onSelect={(selectedItem, index) => {
          setSelectedCollege(selectedItem);
        }}
      />
      {selectedCollege && (
        <Animated.View
          style={{ width: "100%" }}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <SelectDropdown
            search={true}
            searchInputStyle={{
              backgroundColor: "#232D4A",
            }}
            ref={campusDropDownRef}
            searchPlaceHolder="Search campuses..."
            searchInputTxtColor="#DFE5F8"
            showsVerticalScrollIndicator={true}
            defaultButtonText={"Select your campus"}
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
            data={campuses}
            onSelect={(selectedItem, index) => {
              setSelectedCampus(selectedItem);
              console.log(selectedItem);
            }}
          />
        </Animated.View>
      )}

      {selectedCampus && (
        <Animated.View
          style={{ width: "100%" }}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <SelectDropdown
            search={true}
            searchInputStyle={{
              backgroundColor: "#232D4A",
            }}
            ref={departmentDropDownRef}
            searchPlaceHolder="Search departments..."
            searchInputTxtColor="#DFE5F8"
            showsVerticalScrollIndicator={true}
            defaultButtonText={"Select your department"}
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
            data={departments}
            onSelect={(selectedItem, index) => {
              setSelectedDepartment(selectedItem);
              console.log(selectedItem);
            }}
          />
        </Animated.View>
      )}

      {selectedDepartment && (
        <Animated.View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <SelectDropdown
            showsVerticalScrollIndicator={true}
            defaultButtonText={"Intake month"}
            buttonStyle={{
              backgroundColor: "#1A2238",
              marginTop: pixelSizeVertical(10),
              height: heightPixel(58),
              borderRadius: 5,
              width: "48%",
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
            data={intakeMonths}
            onSelect={(selectedItem, index) => {
              setSelectedIntakeMonth(selectedItem);
            }}
          />
          <SelectDropdown
            showsVerticalScrollIndicator={true}
            defaultButtonText={"Intake year"}
            buttonStyle={{
              backgroundColor: "#1A2238",
              marginTop: pixelSizeVertical(10),
              height: heightPixel(58),
              borderRadius: 5,
              width: "48%",
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
            data={intakeYears}
            onSelect={(selectedItem, index) => {
              setSelectedIntakeYear(selectedItem);
              console.log(selectedItem);
            }}
          />
        </Animated.View>
      )}

      {selectedIntakeMonth && selectedIntakeYear ? (
        <Animated.View
          style={{ width: "100%" }}
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(300)}
        >
          <Pressable style={styles.loginButton} onPress={handleNext}>
            <Text style={styles.loginButtonText}>next</Text>
          </Pressable>
        </Animated.View>
      ) : null}

      <Pressable
        hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        onPress={handleLogin}
      >
        <Text style={styles.secondaryButton}>login instead</Text>
      </Pressable>
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    alignItems: "center",
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
    marginBottom: pixelSizeVertical(8),
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
    color: "#C4FFF9",
    fontSize: fontPixel(18),
    textTransform: "lowercase",
    fontWeight: "500",
    textDecorationLine: "underline",
    marginTop: pixelSizeVertical(24),
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
});
