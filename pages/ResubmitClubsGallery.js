import storage from "@react-native-firebase/storage";
import * as Crypto from "expo-crypto";
import FastImage from "react-native-fast-image";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  addClubsGallery,
  handleDeleteClubGallery,
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

export default function ResubmitClubsGallery({ navigation, route }) {
  const { gallery } = route.params;

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
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittedImage, setSubmittedImage] = useState("");

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const [headerHeight] = useState(150);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [errors, setErrors] = useState({
    title: undefined,
    image: undefined,
  });

  useEffect(() => {
    setSubmittedImage(gallery.image);
    setTitle(gallery.title);
    setContent(gallery.content);
    setImage(gallery.image);
    setRejectionReason(gallery.rejectionReason);
  }, []);

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

  const handleAddToGallery = () => {
    //verify image and title
    const errors = { ...errors };

    if (!title.trim()) errors.title = "Please enter a title for your photo.";
    if (!image) errors.image = "Please choose a photo to add.";

    if (!errors.title && !errors.image) {
      dispatch({ type: SET_LOADING_DATA });

      const name = Crypto.randomUUID();
      const imageFileName = `${name}.${imageType}`;
      const firebasePath = `clubs/gallery/photos/${club.clubID}/${imageFileName}`;

      if (image !== submittedImage) {
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
            const galleryID = Crypto.randomUUID();

            let hasGallery = true;
            if (!club.gallery) hasGallery = false;

            dispatch(
              addClubsGallery(
                club.name,
                club.clubID,
                currentMember.userID,
                url,
                title,
                content,
                campusID,
                galleryID,
                hasGallery,
                gallery.galleryID
              )
            );

            setImage("");
            setImageType("");
            setTitle("");
            setContent("");

            //check if clubs.gallery is false
            //if it is, update clubs.gallery as true
            //if (!club.gallery) dispatch(setClubGalleryToTrue(club.clubID));
          })
          .catch((error) => {
            Toast.show({
              type: "error",
              text1: "something went wrong",
            });
            console.error(error);
          });
      } else {
        //store in gallery db and update in local
        const galleryID = Crypto.randomUUID();

        let hasGallery = true;
        if (!club.gallery) hasGallery = false;

        dispatch(
          addClubsGallery(
            club.name,
            club.clubID,
            currentMember.userID,
            image,
            title,
            content,
            campusID,
            galleryID,
            hasGallery,
            gallery.galleryID
          )
        );

        setImage("");
        setImageType("");
        setTitle("");
        setContent("");

        //check if clubs.gallery is false
        //if it is, update clubs.gallery as true
        //if (!club.gallery) dispatch(setClubGalleryToTrue(club.clubID));
      }
      //dispatch(handleDeleteClubGallery(gallery.galleryID, club.clubID, false));
      dispatch(
        sendAdminNotification(
          "galleryResubmission",
          club.name,
          "",
          "",
          campusID
        )
      );
      navigation.goBack();
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
        .child(`clubs/gallery/photos/${club.clubID}/${imageFileName}`)
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

  const handleWithdraw = () => {
    dispatch(handleDeleteClubGallery(gallery.galleryID, club.clubID, true));
    handleNavigateBack();
  };

  useEffect(() => {
    //if scroll height is more than header height and the header is not shown, show
    if (scrollHeight > headerHeight && !showMiniHeader) setShowMiniHeader(true);
    else if (scrollHeight < headerHeight && showMiniHeader)
      setShowMiniHeader(false);
  }, [scrollHeight, showMiniHeader]);

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
              resubmit photo
            </Text>
          </Animated.View>
        ) : (
          <Text style={styles.headerMiniInvisible}>title</Text>
        )}
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
      <ScrollView
        scrollEventThrottle={16}
        onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      >
        <View style={styles.paddingContainer}>
          <View style={{ width: "100%", flexDirection: "column" }}>
            <Header header="resubmit photo" />
            <Text style={styles.disclaimer}>{rejectionReason}</Text>

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
            <CustomTextInput
              placeholder="Enter the title"
              label="title"
              value={title}
              multiline
              editable={!loading}
              onChangeText={(title) => setTitle(title)}
            />
            {errors.title ? (
              <Text style={styles.error}>{errors.title}</Text>
            ) : null}
            <CustomTextInput
              placeholder="Share more details about the photo..."
              label="details"
              value={content}
              multiline
              numberOfLines={4}
              editable={!loading}
              onChangeText={(content) => setContent(content)}
            />
            <PrimaryButton
              loading={loading}
              onPress={handleAddToGallery}
              text="resubmit"
            />
            <Pressable onPress={() => setShowWithdrawModal(!showWithdrawModal)}>
              <Text style={styles.secondaryButton}>withdraw</Text>
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
      <Modal
        isVisible={showWithdrawModal}
        onBackdropPress={() => setShowWithdrawModal(!showWithdrawModal)} // Android back press
        animationIn="bounceIn" // Has others, we want slide in from the left
        animationOut="bounceOut" // When discarding the drawer
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.withdrawPopupStyle} // Needs to contain the width, 75% of screen width in our case
      >
        <View style={styles.withdrawMenu}>
          <Text
            style={[
              styles.rejectionReason,
              { textAlign: "center", marginBottom: pixelSizeHorizontal(8) },
            ]}
          >
            Are you sure to withdraw this photo?
          </Text>
          <PrimaryButton
            loading={loading}
            onPress={handleWithdraw}
            text="withdraw"
          />
          <Pressable onPress={() => setShowWithdrawModal(!showWithdrawModal)}>
            <Text style={styles.withdrawButton}>cancel</Text>
          </Pressable>
        </View>
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
  disclaimer: {
    marginTop: pixelSizeVertical(-8),
    fontSize: fontPixel(18),
    fontWeight: "400",
    color: "#C8A427",
    paddingLeft: pixelSizeHorizontal(2),
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
  withdrawPopupStyle: {
    margin: 16,
    width: "auto", // SideMenu width
    alignSelf: "center",
  },
  withdrawMenu: {
    height: "auto",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    backgroundColor: "#131A2E",
    display: "flex",
    borderRadius: 5,
  },
  rejectionReason: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
  },
  withdrawButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
  },
});
