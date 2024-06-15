import DateTimePicker from "@react-native-community/datetimepicker";
import storage from "@react-native-firebase/storage";
import dayjs from "dayjs";
import * as Crypto from "expo-crypto";
import FastImage from "react-native-fast-image";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  addClubEvent,
  sendAdminNotification,
} from "../src/redux/actions/dataActions";
import { SET_LOADING_DATA } from "../src/redux/type";
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";
import EmptyView from "../components/EmptyView";
import CustomTextInput from "../components/CustomTextInput";

const { width } = Dimensions.get("window");

export default function AddClubsEvent({ navigation }) {
  const dispatch = useDispatch();
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const club = useSelector((state) => state.data.clubData.club);
  const loading = useSelector((state) => state.data.loading);
  const campusID = useSelector((state) => state.data.campus.campusID);

  //get current member data from redux

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [image, setImage] = useState("");
  const [imageType, setImageType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [errors, setErrors] = useState({
    title: undefined,
    content: undefined,
    date: undefined,
  });

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleAddPhoto = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: "Images",
      allowsEditing: true,
      quality: 0.8,
    })
      .then((result) => {
        if (!result.canceled) {
          // User picked an image
          const uri = result.assets[0].uri;
          setImageType(uri.split(".")[uri.split(".").length - 1]);
          setImage(uri);
        }
      })
      .catch((error) => {
        console.error(error);
        Toast.show({
          type: "success",
          text1: "",
        });
      });
  };

  const handleConfirmDatePicker = (event, date) => {
    setDate(date.toISOString());
    setDatePickerVisibility(!isDatePickerVisible);
  };

  const handleAddToEvent = () => {
    //verify image and title
    const errors = { ...errors };

    if (!title.trim()) errors.title = "Please enter a title for your event.";
    if (!content) errors.content = "Please explain about your event.";
    if (!date) errors.date = "Please add a date for your event.";

    if (!errors.title && !errors.content && !errors.date) {
      const eventID = Crypto.randomUUID();

      if (image) {
        dispatch({ type: SET_LOADING_DATA });

        const name = Crypto.randomUUID();
        const imageFileName = `${name}.${imageType}`;
        const firebasePath = `clubs/events/photos/${club.clubID}/${imageFileName}`;
        //first upload image and get url
        uriToBlob(image)
          .then((blob) => {
            return uploadToFirebase(blob, imageFileName);
          })
          .then((snapshot) => {
            return storage().ref(firebasePath).getDownloadURL();
          })
          .then((url) => {
            //store in gallery db and update in local

            //check if clubs.events is false
            //if it is, update clubs.events as true

            let hasEvents = true;
            if (!club.events) hasEvents = false;

            dispatch(
              addClubEvent(
                club.name,
                club.clubID,
                currentMember.userID,
                url,
                title,
                content,
                date,
                eventID,
                campusID,
                hasEvents
              )
            );

            setImage("");
            setImageType("");
            setTitle("");
            setContent("");
            setDate("");
          })
          .catch((error) => {
            throw error;
          });
      } else {
        const url = "";

        let hasEvents = true;
        if (!club.events) hasEvents = false;

        dispatch(
          addClubEvent(
            club.name,
            club.clubID,
            currentMember.userID,
            url,
            title,
            content,
            date,
            eventID,
            campusID,
            hasEvents
          )
        );

        setImage("");
        setImageType("");
        setTitle("");
        setContent("");
        setDate("");

        //check if clubs.events is false
        //if it is, update clubs.events as true
        //if (!club.events) dispatch(setClubEventToTrue(club.clubID));
      }
      dispatch(
        sendAdminNotification("createAnEvent", club.name, "", "", campusID)
      );
    }

    setErrors(errors);
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error("uriToBlob failed"));
      };
      // this helps us get a blob
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);

      xhr.send(null);
    });
  };

  const uploadToFirebase = (blob, imageFileName) => {
    return new Promise((resolve, reject) => {
      const storageRef = storage().ref();

      storageRef
        .child(`clubs/events/photos/${club.clubID}/${imageFileName}`)
        .put(blob)
        .then((snapshot) => {
          blob.close();
          resolve(snapshot);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
      style={styles.container}
    >
      <IosHeight />
      <View style={styles.headerContainerShowMiniHeader}>
        <Pressable
          onPress={handleNavigateBack}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Text style={styles.backButton}>back</Text>
        </Pressable>

        <Pressable
          onPress={toggleSideMenu}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <FastImage
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>
      <ScrollView>
        <View style={styles.paddingContainer}>
          <View style={{ width: "100%", flexDirection: "column" }}>
            <Header header="add an event" />
            <Text style={styles.disclaimer}>{club.name}</Text>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: pixelSizeVertical(28),
              }}
            >
              <Pressable onPress={handleAddPhoto} style={styles.imagePicker}>
                <Text
                  style={{
                    fontSize: fontPixel(16),
                    fontWeight: "400",
                    color: "#DFE5F8",
                  }}
                >
                  {image ? "Choose a different photo" : "Choose a photo"}
                </Text>
              </Pressable>
            </View>
            <CustomTextInput
              label="title"
              placeholder="Enter the title"
              value={title}
              multiline={true}
              editable={!loading}
              onChangeText={(title) => setTitle(title)}
            />
            {errors.title ? (
              <Text style={styles.error}>{errors.title}</Text>
            ) : null}
            <CustomTextInput
              label="details"
              placeholder="Share more details about the event..."
              value={content}
              multiline={true}
              numberOfLines={4}
              editable={!loading}
              onChangeText={(content) => setContent(content)}
            />
            {errors.content ? (
              <Text style={styles.error}>{errors.content}</Text>
            ) : null}
            <Pressable
              disabled={loading}
              style={styles.datePickerButton}
              onPress={() => setDatePickerVisibility(!isDatePickerVisible)}
            >
              <Text style={styles.datePickerButtonText}>
                {date === ""
                  ? "select date"
                  : dayjs(date.split("T")[0]).format("D MMM YYYY")}
              </Text>
            </Pressable>
            {errors.date ? (
              <Text style={styles.error}>{errors.date}</Text>
            ) : null}
            {isDatePickerVisible && (
              <DateTimePicker
                value={new Date()}
                maximumDate={new Date(2030, 10, 20)}
                mode="date"
                onChange={handleConfirmDatePicker}
                onConfirm={() => setDatePickerVisibility(!isDatePickerVisible)}
                onCancel={() => setDatePickerVisibility(!isDatePickerVisible)}
              />
            )}
            <PrimaryButton
              loading={loading}
              onPress={handleAddToEvent}
              text="add"
            />
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={styles.secondaryButton}>back</Text>
            </Pressable>
          </View>
        </View>
        <EmptyView />
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
          currentPage="clubspages"
          navigation={navigation}
        />
      </Modal>
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
  paddingContainer: {
    marginTop: pixelSizeVertical(20),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  datePickerButton: {
    backgroundColor: "#232F52",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(18),
    paddingBottom: pixelSizeVertical(18),
    marginTop: pixelSizeVertical(10),
    width: "100%",
    borderRadius: 5,
  },
  datePickerButtonText: {
    fontSize: fontPixel(18),
    fontWeight: "400",
    color: "#DFE5F8",
    textAlign: "center",
  },
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
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
    color: "#ed3444",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
});
