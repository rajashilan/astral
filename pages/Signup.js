import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
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
import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { firebase } from "../src/firebase/config";

import IosHeight from "../components/IosHeight";

const db = firebase.firestore();

export default function Signup({ navigation }) {
  const [email, setEmail] = useState("");

  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");

  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");

  const [departments, setDepartments] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [intakeMonths, setIntakeMonths] = useState([]);
  const [intakeYears] = useState([
    2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
  ]);
  const [selectedIntakeMonth, setSelectedIntakeMonth] = useState("");
  const [selectedIntakeYear, setSelectedIntakeYear] = useState(0);

  const [collegeSuffix, setCollegeSuffix] = useState("");

  const [loadingColleges, setLoadingColleges] = useState(false);
  const [loadingCampuses, setLoadingCampuses] = useState(false);
  const [loadingCampusDetails, setLoadingCampusDetails] = useState(false);

  const departmentDropDownRef = useRef({});
  const campusDropDownRef = useRef({});

  const handleNext = () => {
    navigation.navigate("SignupDetails", {
      college: selectedCollege,
      campus: selectedCampus,
      department: selectedDepartment,
      intake: `${selectedIntakeMonth} ${selectedIntakeYear}`,
      suffix: collegeSuffix,
    });
  };

  const handleLogin = () => {
    navigation.replace("Login");
  };

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

  //getting college details on load
  useEffect(() => {
    setLoadingColleges(true);
    db.collection("colleges")
      .get()
      .then((data) => {
        let colleges = [];
        data.forEach((doc) => {
          colleges.push(doc.data().name);
        });
        setColleges(colleges);
        setLoadingColleges(false);
      })
      .catch((error) => {
        setLoadingColleges(false);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
        });
        console.error(error);
      });
  }, []);

  //getting campus and suffix details on college select
  useEffect(() => {
    resetAllForCollege();
    setLoadingCampuses(true);

    db.collection("colleges")
      .where("name", "==", selectedCollege)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          setCollegeSuffix(doc.data().suffix);
        });

        db.collection("campuses")
          .where("college", "==", selectedCollege)
          .get()
          .then((data) => {
            let campuses = [];
            data.forEach((doc) => {
              campuses.push(doc.data().name);
            });
            setCampuses(campuses);
            setLoadingCampuses(false);
          })
          .catch((error) => {
            setLoadingCampuses(false);
            Toast.show({
              type: "error",
              text1: "Something went wrong",
            });
            console.error(error);
          });
      })
      .catch((error) => {
        setLoadingCampuses(false);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
        });
        console.error(error);
      });
  }, [selectedCollege]);

  //getting departments and intakes details on campus select
  useEffect(() => {
    resetAllForCampus();
    setLoadingCampusDetails(true);

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
        setLoadingCampusDetails(false);
      })
      .catch((error) => {
        setLoadingCampusDetails(false);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
        });
        console.error(error);
      });
  }, [selectedCampus]);

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
        <View style={styles.progressActive} />
        <View style={styles.progressInactive} />
        <View style={styles.progressInactive} />
      </View>
      <Text style={styles.title}>Let's start with your campus</Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        <SelectDropdown
          search={true}
          searchInputStyle={{
            backgroundColor: "#232D4A",
          }}
          disabled={loadingColleges}
          searchPlaceHolder="Search colleges..."
          searchInputTxtColor="#DFE5F8"
          defaultButtonText={
            loadingColleges ? "Loading colleges..." : "Select your college"
          }
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
              disabled={loadingCampuses}
              defaultButtonText={
                loadingCampuses ? "Loading campuses..." : "Select your campus"
              }
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
              disabled={loadingCampusDetails}
              defaultButtonText={
                loadingCampusDetails
                  ? "Loading departments..."
                  : "Select your department"
              }
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
        <Pressable onPress={handleLogin}>
          <Text style={styles.secondaryButton}>login instead</Text>
        </Pressable>
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
    textAlign: "center",
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
});
