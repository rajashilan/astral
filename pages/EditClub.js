import storage from "@react-native-firebase/storage";
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
} from "react-native";
import Modal from "react-native-modal";
import SelectDropdown from "react-native-select-dropdown";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  createNotification,
  handleActivateClub,
  handleDeactivateClub,
  updateClubImage,
} from "../src/redux/actions/dataActions";
import { SET_UI_LOADING, STOP_UI_LOADING } from "../src/redux/type";
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";

const { width } = Dimensions.get("window");

export default function EditClub({ navigation }) {
  const dispatch = useDispatch();
  const club = useSelector((state) => state.data.clubData.club);
  const loading = useSelector((state) => state.data.loading);
  const imageLoading = useSelector((state) => state.UI.loading);
  const campusID = useSelector((state) => state.data.campus.campusID);

  //view existing members
  //view members request

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [activeStatus] = useState(club.status);
  const [activeSelection] = useState(["activate", "deactivate"]);
  const [selectedActive, setSelectedActive] = useState("");

  const [imageType, setImageType] = useState("");

  const [errors, setErrors] = useState({
    active: undefined,
  });

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleEditActiveStatus = () => {
    const errors = [...errors];

    if (
      (!club.gallery ||
        !club.events ||
        club.details.schedule === "" ||
        club.details.fees === "") &&
      selectedActive === "activate"
    )
      errors.active =
        "Please activate the club by completing your details. Wait for the details to be approved if not yet approved.";

    if (!errors.active) {
      if (selectedActive === "activate") {
        dispatch(handleActivateClub(club.clubID, campusID));

        const notification = {
          preText: "",
          postText: "has been activated by President.",
          sourceID: club.clubID,
          sourceName: club.name,
          sourceImage: club.image,
          sourceDestination: "ClubsPages",
          defaultText: "",
          read: false,
          userID: "",
          createdAt: new Date().toISOString(),
          notificationID: "",
        };
        const userIDs = [];
        const temp = Object.values(club.roles);
        temp.forEach((role) => {
          if (role.userID && role.userID !== "") userIDs.push(role.userID);
        });

        dispatch(createNotification(notification, userIDs));
      }
      if (selectedActive === "deactivate") {
        dispatch(handleDeactivateClub(club.clubID, campusID, true));

        const notification = {
          preText: "",
          postText: "has been deactivated by President",
          sourceID: club.clubID,
          sourceName: club.name,
          sourceImage: club.image,
          sourceDestination: "ClubsPages",
          defaultText: "",
          read: false,
          userID: "",
          createdAt: new Date().toISOString(),
          notificationID: "",
        };
        const userIDs = [];
        const temp = Object.values(club.roles);
        temp.forEach((role) => {
          if (role.userID && role.userID !== "") userIDs.push(role.userID);
        });

        dispatch(createNotification(notification, userIDs));
      }
    }
    setErrors(errors);
  };

  const handleUpdatePhoto = () => {
    const name = Crypto.randomUUID();
    const imageFileName = `${name}.${imageType}`;
    const firebasePath = `clubs/photos/${imageFileName}`;

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
          return uriToBlob(uri);
        }
      })
      .then((blob) => {
        dispatch({ type: SET_UI_LOADING });
        return uploadToFirebase(blob, imageFileName);
      })
      .then((snapshot) => {
        return storage().ref(firebasePath).getDownloadURL();
      })
      .then((url) => {
        //store in clubmembers db and update in redux
        dispatch(updateClubImage(club.clubID, url, campusID));
      })
      .catch((error) => {
        if (!error === "cancelled")
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
        dispatch({ type: STOP_UI_LOADING });
      });
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
        .child(`clubs/photos/${imageFileName}`)
        .put(blob)
        .then((snapshot) => {
          blob.close();
          resolve(snapshot);
        })
        .catch((error) => {
          reject(error);
          dispatch({ type: STOP_UI_LOADING });
        });
    });
  };

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
            <Header header={"edit club's details"} />
            <Text style={styles.disclaimer}>{club.name}</Text>

            {!imageLoading ? (
              <Pressable onPress={handleUpdatePhoto}>
                <FastImage
                  style={styles.image}
                  resizeMode="cover"
                  source={{ uri: club.image }}
                  progressiveRenderingEnabled={true}
                  cache={FastImage.cacheControl.immutable}
                  priority={FastImage.priority.normal}
                />
              </Pressable>
            ) : (
              <View
                style={{
                  width: "100%",
                  backgroundColor: "#495986",
                  height: heightPixel(150),
                  marginTop: pixelSizeVertical(24),
                  marginBottom: pixelSizeVertical(10),
                  borderRadius: 5,
                }}
              />
            )}

            <SelectDropdown
              search
              searchInputStyle={{
                backgroundColor: "#232D4A",
              }}
              disabled={loading}
              searchPlaceHolder="select active status"
              searchInputTxtColor="#DFE5F8"
              defaultButtonText={`current status: ${activeStatus}`}
              showsVerticalScrollIndicator
              buttonStyle={{
                backgroundColor: "#1A2238",
                marginTop: pixelSizeVertical(10),
                marginBottom: pixelSizeVertical(10),
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
              data={activeSelection}
              onSelect={(selectedItem, index) => {
                setSelectedActive(selectedItem);
              }}
            />
            {errors.active ? (
              <Text style={styles.error}>{errors.active}</Text>
            ) : null}

            <Pressable
              onPress={() => navigation.navigate("ClubCurrentMembers")}
            >
              <Text style={styles.altButton}>current members</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("ClubMembersRequest")}
            >
              <Text
                style={
                  club.membersRequests && club.membersRequests.length > 0
                    ? styles.altButton
                    : styles.altButtonInactive
                }
              >
                members' requests
              </Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("EditClubRoles")}>
              <Text style={styles.altButton}>edit roles</Text>
            </Pressable>

            {selectedActive && (
              <>
                <PrimaryButton
                  loading={loading}
                  onPress={handleEditActiveStatus}
                  text="save"
                />
                <Pressable
                  onPress={() => {
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.secondaryButton}>cancel</Text>
                </Pressable>
              </>
            )}
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
          currentPage="clubspages"
          navigation={navigation}
        />
      </Modal>
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
    height: heightPixel(150),
    marginTop: pixelSizeVertical(24),
    marginBottom: pixelSizeVertical(10),
    borderRadius: 5,
  },
  disclaimer: {
    marginTop: pixelSizeVertical(-18),
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#C6CDE2",
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
