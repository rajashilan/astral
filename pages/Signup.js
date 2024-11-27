import firestore from "@react-native-firebase/firestore";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Toast from "react-native-toast-message";

import logo from "../assets/logo.png";
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
import CustomSelectDropdown from "../components/CustomSelectDropdown";

const db = firestore();

export default function Signup({ navigation }) {
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");

  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");

  const [departments, setDepartments] = useState([]);

  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [intakeMonths, setIntakeMonths] = useState([]);
  const [intakeYears] = useState([
    2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024,
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
    db.collection("collegeNames")
      .get()
      .then((data) => {
        const colleges = [];
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

    db.collection("collegeNames")
      .where("name", "==", selectedCollege)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          setCollegeSuffix(doc.data().suffix);
        });

        db.collection("campusNames")
          .where("college", "==", selectedCollege)
          .get()
          .then((data) => {
            const campuses = [];
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

    db.collection("campusNames")
      .where("name", "==", selectedCampus)
      .get()
      .then((data) => {
        const departments = [];
        const intakes = [];

        data.forEach((doc) => {
          doc.data().departments.forEach((department) => {
            departments.push(department);
          });
          doc.data().intakes.forEach((intake) => {
            intakes.push(intake);
          });
        });

        setDepartments(departments);
        //setIntakeMonths(intakes);
        setIntakeMonths([
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
      style={styles.container}
    >
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        style={{
          width: "100%",
          paddingRight: pixelSizeHorizontal(16),
          paddingLeft: pixelSizeHorizontal(16),
        }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <IosHeight />
        <FastImage
          style={styles.image}
          source={logo}
          resizeMode="contain"
          transition={1000}
        />
        <View style={styles.progressContainer}>
          <View style={styles.progressActive} />
          <View style={styles.progressInactive} />
        </View>
        <Text style={styles.title}>Let's start with your campus</Text>

        <CustomSelectDropdown
          data={colleges}
          onSelect={(selectedItem, index) => {
            setSelectedCollege(selectedItem);
          }}
          defaultText="Select your college"
          loadingText="Loading colleges..."
          loading={loadingColleges}
        />
        {selectedCollege && (
          <Animated.View
            style={{ width: "100%" }}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <CustomSelectDropdown
              data={campuses}
              onSelect={(selectedItem, index) => {
                setSelectedCampus(selectedItem);
              }}
              defaultText="Select your campus"
              loadingText="Loading campuses..."
              loading={loadingCampuses}
              ref={campusDropDownRef}
            />
          </Animated.View>
        )}

        {selectedCampus && (
          <Animated.View
            style={{ width: "100%" }}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <CustomSelectDropdown
              fixedHeight={true}
              data={departments}
              onSelect={(selectedItem, index) => {
                setSelectedDepartment(selectedItem);
              }}
              defaultText="Select your department"
              loadingText="Loading departments..."
              loading={loadingCampusDetails}
              ref={departmentDropDownRef}
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
            <CustomSelectDropdown
              fixedHeight={true}
              data={intakeMonths}
              onSelect={(selectedItem, index) => {
                setSelectedIntakeMonth(selectedItem);
              }}
              defaultText="Intake month"
              customDropdownButtonStyle={{
                width: "48%",
              }}
            />

            <CustomSelectDropdown
              fixedHeight={true}
              data={intakeYears}
              onSelect={(selectedItem, index) => {
                setSelectedIntakeYear(selectedItem);
              }}
              defaultText="Intake year"
              customDropdownButtonStyle={{
                width: "48%",
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
            <PrimaryButton onPress={handleNext} text="next" />
          </Animated.View>
        ) : null}
        <Pressable onPress={handleLogin}>
          <Text style={styles.secondaryButton}>login instead</Text>
        </Pressable>
        <EmptyView />
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
