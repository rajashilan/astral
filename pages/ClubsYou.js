import storage from "@react-native-firebase/storage";
import * as Crypto from "expo-crypto";
import FastImage from "react-native-fast-image";
import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  updateClubMemberBio,
  updateClubMemberPhoto,
} from "../src/redux/actions/dataActions";
import { SET_LOADING_USER, STOP_LOADING_USER } from "../src/redux/type";
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";
import EmptyView from "../components/EmptyView";

const { width } = Dimensions.get("window");

export default function ClubsYou({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.credentials);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const club = useSelector((state) => state.data.clubData.club);

  const loading = useSelector((state) => state.data.loading);
  const imageLoading = useSelector((state) => state.user.loading);

  //get current member data from redux

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [bio, setBio] = useState("");
  const [imageType, setImageType] = useState("");

  useEffect(() => {
    setBio(currentMember.bio);
  }, []);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  //edit the club member's bio, not the user's original bio
  //the user can have a different bio for different clubs
  const handleUpdateBio = () => {
    dispatch(updateClubMemberBio(club.name, club.clubID, user.userId, bio));
  };

  const handleUpdatePhoto = () => {
    const name = Crypto.randomUUID();
    const imageFileName = `${name}.${imageType}`;
    const firebasePath = `clubs/members/photos/${imageFileName}`;

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
          console.log("uri: ", uri);
          return uriToBlob(uri);
        }
      })
      .then((blob) => {
        dispatch({ type: SET_LOADING_USER });
        return uploadToFirebase(blob, imageFileName);
      })
      .then((snapshot) => {
        console.log("snapshot");
        return storage().ref(firebasePath).getDownloadURL();
      })
      .then((url) => {
        //store in clubmembers db and update in redux
        dispatch(
          updateClubMemberPhoto(club.name, club.clubID, user.userId, url)
        );
      })
      .catch((error) => {
        if (!error === "cancelled")
          Toast.show({
            type: "error",
            text1: "Something went wrong",
          });
        dispatch({ type: STOP_LOADING_USER });
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
        .child(`clubs/members/photos/${imageFileName}`)
        .put(blob)
        .then((snapshot) => {
          blob.close();
          resolve(snapshot);
        })
        .catch((error) => {
          console.error(error);
          dispatch({ type: STOP_LOADING_USER });
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
          {!imageLoading ? (
            <Pressable onPress={handleUpdatePhoto}>
              <FastImage
                style={styles.image}
                resizeMode="cover"
                source={{ uri: currentMember.profileImage }}
                progressiveRenderingEnabled={true}
                cache={FastImage.cacheControl.immutable}
                priority={FastImage.priority.normal}
              />
            </Pressable>
          ) : (
            <View
              style={{
                width: "100%",
                height: heightPixel(280),
                backgroundColor: "#495986",
                marginBottom: pixelSizeVertical(12),
                borderRadius: 5,
              }}
            />
          )}
          {currentMember && (
            <Text style={styles.role}>{currentMember.role}</Text>
          )}
          <Text style={styles.name}>
            {currentMember.name} - Intake {currentMember.intake},{" "}
            {currentMember.department}
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your bio"
            placeholderTextColor="#DBDBDB"
            value={bio}
            multiline
            numberOfLines={4}
            editable={!loading}
            onChangeText={(bio) => setBio(bio)}
          />

          {bio !== currentMember.bio && (
            <>
              <PrimaryButton
                loading={loading}
                text="save"
                onPress={handleUpdateBio}
              />

              <Pressable
                onPress={() => {
                  setBio(currentMember.bio);
                }}
              >
                <Text style={styles.tertiaryButton}>discard</Text>
              </Pressable>
            </>
          )}
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
          currentPage="clubs"
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
  },
  tertiaryButton: {
    color: "#A7AFC7",
    fontSize: fontPixel(22),
    textTransform: "lowercase",
    fontWeight: "400",
    textAlign: "center",
  },
});
