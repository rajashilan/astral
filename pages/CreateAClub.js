import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

import * as Crypto from "expo-crypto";

import IosHeight from "../components/IosHeight";
import Header from "../components/Header";
import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import { firebase } from "../src/firebase/config";

import { useDispatch, useSelector } from "react-redux";
import { ADD_USER_CLUB } from "../src/redux/type";

const { width } = Dimensions.get("window");

const db = firebase.firestore();

export default function Login({ navigation, route }) {
  const user = useSelector((state) => state.user.credentials);
  const state = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({
    name: undefined,
  });

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const handleSubmit = () => {
    let errors = [...errors];

    if (!name.trim()) errors.name = "Please enter your club's name";

    if (!errors.name) {
      setLoading(true);

      //create a new club
      //first add to clubs
      //then add to clubs overview (campus admin will get data from here)

      const memberID = Crypto.randomUUID();
      let clubID = "";
      const createdAt = new Date();
      const createdBy = user.userId;

      let clubsData = {
        clubID: "", //get it later after adding
        name,
        image: "",
        members: [
          {
            name: user.name,
            phone_number: user.phone_number,
            email: user.email,
            intake: user.intake,
            department: user.department,
            memberID, //to be generated
            role: "president", //by default
            createdAt,
            profileImage: "",
            bio: "",
          },
        ],
        gallery: [],
        events: [],
        details: [],
        roles: [
          {
            president: {
              memberID, //to be generated
              alternateName: "",
            },
            vicePresident: {
              memberID: "", //to be generated
              alternateName: "",
            },
            secretary: {
              memberID: "", //to be generated
              alternateName: "",
            },
            treasurer: {
              memberID: "", //to be generated
              alternateName: "",
            },
            members: {
              alternateName: "",
              membersIDs: [],
            },
          },
        ],
        approval: "pending",
        rejectionReason: "",
        status: "inactive",
        membersRequests: [],
        createdAt,
        createdBy,
        campusID: state.campus.campusID,
      };

      let clubsOverviewData = {
        name,
        image: "",
        clubID: "", //to be added later
        approval: "pending",
        rejectionReason: "",
        status: "inactive",
        createdBy,
        campusID: state.campus.campusID,
      };

      let userData = {
        clubID: "",
        memberID,
        role: "president",
        approval: "pending",
        createdBy,
      };

      let index = user.clubs.findIndex(
        (club) => club.approval === "pending" && club.createdBy === user.userId
      );

      if (index === -1) {
        db.collection("clubs")
          .add(clubsData)
          .then((data) => {
            clubID = data.id;
            return db.doc(`/clubs/${clubID}`).update({ clubID });
          })
          .then(() => {
            clubsOverviewData.clubID = clubID;

            //first check if the campusID is in clubsOverview collection
            db.doc(`/clubsOverview/${state.campus.campusID}`)
              .get()
              .then((doc) => {
                if (!doc.exists) {
                  return db
                    .collection("clubsOverview")
                    .doc(state.campus.campusID)
                    .set({ clubs: [clubsOverviewData] });
                } else {
                  let temp = doc.data().clubs;
                  temp.push(clubsOverviewData);

                  return db
                    .doc(`/clubsOverview/${state.campus.campusID}`)
                    .update({ clubs: [...temp] });
                }
              })
              .then(() => {
                //then add to the user's clubs list

                userData.clubID = clubID;

                db.doc(`/users/${user.userId}`)
                  .get()
                  .then((doc) => {
                    let temp = doc.data().clubs;
                    temp.push(userData);

                    return db
                      .doc(`/users/${user.userId}`)
                      .update({ clubs: [...temp] });
                  })
                  .then(() => {
                    setLoading(false);

                    //after creating, immediately append to user's local state list of clubs overview
                    //after creating, add to local states yours list of clubs

                    dispatch({ type: ADD_USER_CLUB, payload: userData });

                    setSuccessMessage(
                      "Request submitted! Stay tuned for updates"
                    );
                    setErrors({
                      name: undefined,
                    });
                  });
              });
          })
          .catch((error) => {
            setLoading(false);
            console.error(error);
            dispatch({ type: STOP_LOADING_DATA });
          });
      } else {
        errors.name = "You can only create a request for one club at a time.";
        setLoading(false);
      }
    }

    setErrors(errors);
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.navigate("Clubs");
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
      <View style={{ width: "100%" }}>
        <Header header={"create a club"} />
        <Text style={styles.disclaimer}>
          Your club has to be approved by the college before you can continue
          adding details and list it publicly.
        </Text>
      </View>
      <TextInput
        style={styles.textInput}
        placeholder="Enter your club's name"
        placeholderTextColor="#DBDBDB"
        value={name}
        editable={!loading}
        onChangeText={(name) => setName(name)}
      />
      {errors.name ? <Text style={styles.error}>{errors.name}</Text> : null}
      <Text style={styles.disclaimerPadding}>
        *Your club’s name cannot be changed later on.
      </Text>
      <Pressable
        style={loading ? styles.loginButtonDisabled : styles.loginButton}
        onPress={handleSubmit}
      >
        <Text
          style={
            loading ? styles.loginButtonLoadingText : styles.loginButtonText
          }
        >
          {loading ? "creating..." : "create request"}
        </Text>
      </Pressable>
      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}
      <Toast config={toastConfig} />
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
  imageBackground: {
    flex: 1,
    backgroundColor: "#0C111F",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    backgroundColor: "#0C111F",
  },
  image: {
    width: widthPixel(177),
    height: heightPixel(93),
    marginBottom: pixelSizeVertical(38),
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
    marginTop: pixelSizeVertical(28),
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
    color: "#C4FFF9",
    fontSize: fontPixel(18),
    textTransform: "lowercase",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  forgotPasswordButton: {
    color: "#C4FFF9",
    fontSize: fontPixel(14),
    textTransform: "lowercase",
    fontWeight: "400",
    marginBottom: pixelSizeVertical(34),
  },
  welcomeTitle: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    textAlign: "center",
    marginTop: pixelSizeVertical(-26),
    marginBottom: pixelSizeVertical(4),
  },
  welcomeSubheading: {
    fontSize: fontPixel(14),
    fontWeight: "500",
    color: "#C6CDE2",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: pixelSizeVertical(16),
  },
  error: {
    marginTop: pixelSizeVertical(8),
    marginBottom: pixelSizeVertical(8),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#a3222d",
    textAlign: "left",
    width: "100%",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  errorUnderButton: {
    marginTop: pixelSizeVertical(-12),
    marginBottom: pixelSizeVertical(16),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#a3222d",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    textAlign: "center",
  },
  successText: {
    marginTop: pixelSizeVertical(-8),
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#1EE271",
    lineHeight: 18,
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    textAlign: "center",
  },
  disclaimer: {
    marginTop: pixelSizeVertical(-18),
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 18,
    paddingLeft: pixelSizeHorizontal(2),
  },
  disclaimerPadding: {
    marginTop: pixelSizeVertical(8),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#A7AFC7",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    textAlign: "left",
    width: "100%",
  },
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
  },
  headerContainer: {
    marginTop: pixelSizeVertical(20),
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: pixelSizeVertical(8),
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(30),
  },
  headerMini: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    marginRight: pixelSizeHorizontal(16),
    maxWidth: width - 100,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  headerContainerHideMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  backButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#C4FFF9",
    marginTop: pixelSizeVertical(2),
  },
});
