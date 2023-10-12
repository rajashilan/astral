import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TextInput,
  ScrollView,
  Linking,
} from "react-native";
import WebView from "react-native-webview";
import React, { useEffect, useState } from "react";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

import DateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";

import IosHeight from "../components/IosHeight";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import { useDispatch, useSelector } from "react-redux";

import Header from "../components/Header";

const { width } = Dimensions.get("window");

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import axios from "axios";

import { firebase } from "../src/firebase/config";
const db = firebase.firestore();

export default function GeneralFormsPage({ navigation, route }) {
  const { id } = route.params;

  const dispatch = useDispatch();
  const club = useSelector((state) => state.data.clubData.club);
  const loading = useSelector((state) => state.data.loading);
  const user = useSelector((state) => state.user.credentials);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [formData, setFormData] = useState([]);
  const [fieldValues, setFieldValues] = useState({});
  const [errors, setErrors] = useState({});

  const [loadingAxios, setLoadingAxios] = useState(false);
  const [url, setUrl] = useState("");

  const [data, setData] = useState({
    title: "",
    id: "",
    link: "",
  });

  useEffect(() => {
    db.doc(`/generalForms/${id}`)
      .get()
      .then((doc) => {
        setData({
          title: doc.data().title,
          id: doc.data().generalFormID,
          link: doc.data().link,
        });
        setFormData([...doc.data().fields]);
        let temp = {};
        let tempFields = {};
        doc.data().fields.forEach((field) => {
          temp[field.fieldName] = undefined;
          tempFields[field.fieldName] = "";
        });
        setErrors({ ...temp });
        setFieldValues({ ...tempFields });
      })
      .catch((error) => {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "something went wrong",
        });
      });
  }, []);

  const onLayout = (event) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  useEffect(() => {
    //if scroll height is more than header height and the header is not shown, show
    if (scrollHeight > headerHeight && !showMiniHeader) setShowMiniHeader(true);
    else if (scrollHeight < headerHeight && showMiniHeader)
      setShowMiniHeader(false);
  }, [scrollHeight, showMiniHeader]);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    var isError = false;

    formData.map((field) => {
      if (!fieldValues[field.fieldName] && field.fieldName !== "dateSigned") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field.fieldName]: field.errorMessage,
        }));
        isError = true;
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [field.fieldName]: undefined,
        }));
      }
    });
    console.log(isError);
    if (!isError) {
      setLoadingAxios(true);
      let pdfData = {
        title: data.title,
        link: data.link,
        matriculationNo: user.email.split("@")[0],
        fields: [],
      };
      formData.forEach((field) => {
        let tempField = { ...field };
        tempField.value = fieldValues[field.fieldName.toString()];
        pdfData.fields.push({ ...tempField });
      });

      axios
        .post(
          "https://asia-southeast1-astral-d3ff5.cloudfunctions.net/api/pdf",
          pdfData
        )
        .then((res) => {
          console.log(res);
          let link = res.data.link;
          setLoadingAxios(false);
          setUrl(link);
        })
        .catch((error) => {
          console.error(error);
          setLoadingAxios(false);
          Toast.show({
            type: "error",
            text1: "something went wrong",
          });
        });
    }
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  let TextFields =
    !isEmpty(formData) && formData
      ? formData.map((field, index) => {
          return (
            <View key={index}>
              {field.fieldType !== "todayDate" ? (
                <TextInput
                  style={styles.textInput}
                  placeholder={field.placeHolder}
                  placeholderTextColor={"#A7AFC7"}
                  value={fieldValues[field.fieldName] || ""}
                  multiline={field.fieldType === "multiline"}
                  numberOfLines={field.fieldType === "multiline" ? 3 : 1}
                  onChangeText={(text) => {
                    setFieldValues((prevData) => ({
                      ...prevData,
                      [field.fieldName]: text,
                    }));
                  }}
                />
              ) : null}
              {!isEmpty(errors) ? (
                errors[field.fieldName] ? (
                  <Text style={styles.error}>{errors[field.fieldName]}</Text>
                ) : null
              ) : null}
            </View>
          );
        })
      : null;

  return (
    <View style={styles.container}>
      <IosHeight />
      <View style={styles.headerContainerShowMiniHeader}>
        <Pressable
          onPress={handleNavigateBack}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Text style={styles.backButton}>back</Text>
        </Pressable>
        {showMiniHeader ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              {data.title}
            </Text>
          </Animated.View>
        ) : (
          <Text style={styles.headerMiniInvisible}>title</Text>
        )}
        <Pressable
          onPress={toggleSideMenu}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Image
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            contentFit="contain"
          />
        </Pressable>
      </View>
      <ScrollView
        scrollEventThrottle={16}
        stickyHeaderIndices={[1]}
        onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      >
        <View style={styles.paddingContainer}>
          <View style={{ width: "100%", flexDirection: "column" }}>
            <View onLayout={onLayout}>
              <Header header={data.title} />
            </View>
            <Text
              style={[
                styles.disclaimer,
                { marginBottom: pixelSizeVertical(28) },
              ]}
            >
              fill in the required fields and download the generated pdf
            </Text>
            {TextFields}
            <Pressable
              style={
                loadingAxios ? styles.loginButtonDisabled : styles.loginButton
              }
              onPress={handleSubmit}
            >
              <Text
                style={
                  loadingAxios
                    ? styles.loginButtonLoadingText
                    : styles.loginButtonText
                }
              >
                {loadingAxios ? "saving..." : "save"}
              </Text>
            </Pressable>
            <View style={styles.emptyView}></View>
          </View>
        </View>
      </ScrollView>
      <Modal
        isVisible={isSideMenuVisible}
        onBackdropPress={toggleSideMenu} // Android back press
        onSwipeComplete={toggleSideMenu} // Swipe to discard
        animationIn="slideInRight" // Has others, we want slide in from the left
        animationOut="slideOutRight" // When discarding the drawer
        swipeDirection="left" // Discard the drawer with swipe to left
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.sideMenuStyle} // Needs to contain the width, 75% of screen width in our case
      >
        <SideMenu
          callParentScreenFunction={toggleSideMenu}
          currentPage={"general forms"}
          navigation={navigation}
        />
      </Modal>
      {url !== "" ? (
        <WebView source={{ uri: url }} style={{ flex: 1 }} />
      ) : null}
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
  },
  paddingContainer: {
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  imageHeaderContainer: {
    height: pixelSizeVertical(120),
    width: "100%",
  },
  overlayContainer: {
    justifyContent: "center",
    height: pixelSizeVertical(120),
    width: "100%",
    backgroundColor: "rgba(12, 17, 31, 0.7)",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
  },
  header: {
    fontSize: fontPixel(34),
    fontWeight: "500",
    color: "#DFE5F8",
  },
  loginButton: {
    backgroundColor: "#07BEB8",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(30),
    width: "100%",
    borderRadius: 5,
  },
  loginButtonText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#0C111F",
    textAlign: "center",
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
  },
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
  },
  headerContainer: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(16),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    alignItems: "center",
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(30),
  },
  backButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#C4FFF9",
    marginTop: pixelSizeVertical(2),
  },
  headerMini: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    maxWidth: width - 180,
    marginLeft: pixelSizeHorizontal(-10),
  },
  headerMiniInvisible: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginRight: pixelSizeHorizontal(16),
    maxWidth: "80%",
    opacity: 0,
  },
  headerContainerShowMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: heightPixel(280),
    marginBottom: pixelSizeVertical(12),
    borderRadius: 5,
  },
  role: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(4),
  },
  name: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  quote: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
  },
  textInput: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    width: "100%",
    borderRadius: 5,
    marginTop: pixelSizeVertical(10),
  },
  loginButtonLoadingText: {
    fontSize: fontPixel(22),
    fontWeight: "400",
    color: "#DFE5F8",
    textAlign: "center",
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
  tertiaryButton: {
    color: "#A7AFC7",
    fontSize: fontPixel(22),
    textTransform: "lowercase",
    fontWeight: "400",
    textAlign: "center",
  },
  disclaimer: {
    marginTop: pixelSizeVertical(-18),
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#C6CDE2",
  },
  imagePicker: {
    backgroundColor: "#232F52",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
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
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
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
  altButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#07BEB8",
    marginTop: pixelSizeVertical(8),
  },
  altButtonInactive: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#07BEB8",
    marginTop: pixelSizeVertical(8),
    opacity: 0.5,
  },
});