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
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  updateUserBio,
  updateUserPhoto,
} from "../src/redux/actions/userActions";
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
import CustomTextInput from "../components/CustomTextInput";

const { width } = Dimensions.get("window");

export default function ClubCurrentMembers({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.credentials);
  const loading = useSelector((state) => state.data.loading);
  const imageLoading = useSelector((state) => state.user.loading);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [bio, setBio] = useState("");
  const [imageType, setImageType] = useState("");

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  useEffect(() => {
    setBio(user.bio);
  }, []);

  useEffect(() => {
    //if scroll height is more than header height and the header is not shown, show
    if (scrollHeight > headerHeight && !showMiniHeader) setShowMiniHeader(true);
    else if (scrollHeight < headerHeight && showMiniHeader)
      setShowMiniHeader(false);
  }, [scrollHeight, showMiniHeader]);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleUpdateBio = () => {
    dispatch(updateUserBio(user.userId, bio));
  };

  const handleUpdatePhoto = () => {
    const name = Crypto.randomUUID();
    const imageFileName = `${name}.${imageType}`;
    const firebasePath = `users/profileImage/${user.userId}/${imageFileName}`;

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
        dispatch({ type: SET_LOADING_USER });
        return uploadToFirebase(blob, imageFileName);
      })
      .then((snapshot) => {
        return storage().ref(firebasePath).getDownloadURL();
      })
      .then((url) => {
        //update in users
        dispatch(updateUserPhoto(user.userId, url));
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
        .child(`users/profileImage/${user.userId}/${imageFileName}`)
        .put(blob)
        .then((snapshot) => {
          blob.close();
          resolve(snapshot);
        })
        .catch((error) => {
          reject(error);
          dispatch({ type: STOP_LOADING_USER });
        });
    });
  };

  return (
    <View style={styles.container}>
      <IosHeight />
      <View style={styles.headerContainerShowMiniHeader}>
        {showMiniHeader ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              profile
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
        stickyHeaderIndices={[1]}
        onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      >
        <View style={styles.paddingContainer}>
          <View style={{ width: "100%", flexDirection: "column" }}>
            <View onLayout={onLayout}>
              <Header header="profile" />
            </View>

            {!imageLoading ? (
              <Pressable onPress={handleUpdatePhoto}>
                <FastImage
                  style={styles.image}
                  resizeMode="cover"
                  source={{ uri: user.profileImage }}
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

            <Text style={styles.name}>
              {user.name} - Intake {user.intake}, {user.department}
            </Text>

            <CustomTextInput
              placeholder="enter your bio"
              value={bio}
              multiline={true}
              numberOfLines={4}
              editable={!loading}
              onChangeText={(bio) => setBio(bio)}
            />

            {bio !== user.bio && (
              <>
                <PrimaryButton
                  loading={loading}
                  onPress={handleUpdateBio}
                  text="save"
                />

                <Pressable
                  onPress={() => {
                    setBio(user.bio);
                  }}
                >
                  <Text style={styles.tertiaryButton}>discard</Text>
                </Pressable>
              </>
            )}
            {user.clubs &&
              user.clubs.map((club) => {
                return (
                  <View
                    key={club.clubID}
                    style={{
                      flexDirection: "column",
                      marginTop: pixelSizeVertical(16),
                    }}
                  >
                    {club.approval === "approved" && (
                      <>
                        <Text style={styles.altText}>{club.role} of </Text>
                        <Pressable
                          onPress={() =>
                            navigation.navigate("ClubsPages", {
                              clubID: club.clubID,
                            })
                          }
                        >
                          <Text style={styles.altButton}>{club.name}</Text>
                        </Pressable>
                      </>
                    )}
                  </View>
                );
              })}
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
          currentPage="profile"
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
    textAlign: "center",
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
  name: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  tertiaryButton: {
    color: "#A7AFC7",
    fontSize: fontPixel(22),
    textTransform: "lowercase",
    fontWeight: "400",
    textAlign: "center",
  },
  altText: {
    fontSize: fontPixel(22),
    fontWeight: "400",
    color: "#DFE5F8",
    marginTop: pixelSizeVertical(8),
  },
  altButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#07BEB8",
  },
});
