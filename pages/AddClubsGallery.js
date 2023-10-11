import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
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
import * as Crypto from "expo-crypto";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";

import IosHeight from "../components/IosHeight";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import { useDispatch, useSelector } from "react-redux";

import * as ImagePicker from "expo-image-picker";

import Header from "../components/Header";

import { firebase } from "../src/firebase/config";
import {
  addClubsGallery,
  setClubGalleryToTrue,
} from "../src/redux/actions/dataActions";
import { SET_LOADING_DATA } from "../src/redux/type";
const db = firebase.firestore();

const { width } = Dimensions.get("window");

export default function AddClubsGallery({ navigation }) {
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

  const [errors, setErrors] = useState({
    title: undefined,
    image: undefined,
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
      aspect: [3, 2],
      quality: 1,
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

  const handleAddToGallery = () => {
    //verify image and title
    let errors = [...errors];

    if (!title.trim()) errors.title = "Please enter a title for your photo.";
    if (!image) errors.image = "Please choose a photo to add.";

    if (!errors.title && !errors.image) {
      dispatch({ type: SET_LOADING_DATA });

      const name = Crypto.randomUUID();
      let imageFileName = `${name}.${imageType}`;
      let firebasePath = `clubs/gallery/photos/${imageFileName}`;

      //first upload image and get url
      uriToBlob(image)
        .then((blob) => {
          return uploadToFirebase(blob, imageFileName);
        })
        .then((snapshot) => {
          return firebase.storage().ref(firebasePath).getDownloadURL();
        })
        .then((url) => {
          //store in gallery db and update in local
          const galleryID = Crypto.randomUUID();

          dispatch(
            addClubsGallery(
              club.name,
              club.clubID,
              currentMember.userID,
              url,
              title,
              content,
              campusID,
              galleryID
            )
          );

          setImage("");
          setImageType("");
          setTitle("");
          setContent("");

          //check if clubs.gallery is false
          //if it is, update clubs.gallery as true
          if (!club.gallery) dispatch(setClubGalleryToTrue(club.clubID));
        })
        .catch((error) => {
          throw error;
        });
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

  uploadToFirebase = (blob, imageFileName) => {
    return new Promise((resolve, reject) => {
      var storageRef = firebase.storage().ref();

      storageRef
        .child(`clubs/gallery/photos/${imageFileName}`)
        .put(blob, {
          contentType: `image/${imageType}`,
        })
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
          <Image
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            contentFit="contain"
          />
        </Pressable>
      </View>
      <ScrollView>
        <View style={styles.paddingContainer}>
          <View style={{ width: "100%", flexDirection: "column" }}>
            <Header header={"add a photo"} />
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
            {errors.image ? (
              <Text style={styles.error}>{errors.image}</Text>
            ) : null}
            <TextInput
              style={styles.textInput}
              placeholder="Enter the title"
              placeholderTextColor="#DBDBDB"
              value={title}
              multiline
              editable={!loading}
              onChangeText={(title) => setTitle(title)}
            />
            {errors.title ? (
              <Text style={styles.error}>{errors.title}</Text>
            ) : null}
            <TextInput
              style={styles.textInput}
              placeholder="Share more details about the photo..."
              placeholderTextColor="#DBDBDB"
              value={content}
              multiline
              numberOfLines={4}
              editable={!loading}
              onChangeText={(content) => setContent(content)}
            />

            <Pressable
              style={loading ? styles.loginButtonDisabled : styles.loginButton}
              onPress={handleAddToGallery}
            >
              <Text
                style={
                  loading
                    ? styles.loginButtonLoadingText
                    : styles.loginButtonText
                }
              >
                {loading ? "adding to gallery..." : "add"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={styles.secondaryButton}>cancel</Text>
            </Pressable>
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
          currentPage={"clubs"}
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
    marginTop: pixelSizeVertical(20),
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
});
