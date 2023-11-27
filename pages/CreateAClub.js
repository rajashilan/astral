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
import * as WebBrowser from "expo-web-browser";
import Checkbox from "expo-checkbox";

import IosHeight from "../components/IosHeight";
import Header from "../components/Header";
import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { useDispatch, useSelector } from "react-redux";
import { ADD_USER_CLUB } from "../src/redux/type";
import * as DocumentPicker from "expo-document-picker";
import { sendAdminNotification } from "../src/redux/actions/dataActions";

const { width } = Dimensions.get("window");

const db = firestore();

export default function CreateAClub({ navigation, route }) {
  const user = useSelector((state) => state.user.credentials);
  const state = useSelector((state) => state.data);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({
    name: undefined,
    document: undefined,
    checkBox: undefined,
  });
  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [isChecked, setChecked] = useState(false);

  const [step, setStep] = useState("step1");

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  //create a club -> request viewed by intima -> approve/reject(with feedback) -> viewed by admin
  //when creating a club, got two tiers of checking, one by intima (SA), one by admim

  //for a campus, have a field named(SA), empty if none
  //in create a club,
  //approval(admin), reviewLevel(admin, sa), saFeedback, saApproval
  //if campus has SA field filled (with email), set reviewLevel="sa"; else, reviewLevel = "admin"
  //in front end, if reviewLevel = "sa", pending approval from student affairs; "admin", pending approval from Admin

  //for admin notification, if club created, reviewLevel = "sa", only send notification to sa
  //if club created, reviewLevel = "sa", or clubResubmission, show notfication to all club admins

  //in dashboard, if current user role = sa, only show reviewLevel="sa"
  //if logged in user role is SA, redirect to saClubs page, only show clubs request with reviewLevel = "sa"
  //get clubs -> according to sa requirements, function for sa to approve/reject club
  //else proceed as usual
  //if sa is filled, and logged in user is admin, everything else as usual, but clubs request only show reviewLevel = "admin"
  //in request show feedback from SA if rejected

  const FPFUrl =
    "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fforms%2FFPF.docx?alt=media&token=57914608-4192-47cf-ad75-fdcfb8b3ac9c&_gl=1*1haaz37*_ga*NTQ3Njc0ODExLjE2ODA3MTQ2Mjg.*_ga_CW55HF8NVT*MTY5ODI5NzM4MS4xOTUuMS4xNjk4Mjk5OTg5LjMuMC4w";

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ], // Specify the type of document you want to pick (e.g., PDF)
      });

      if (result.type === "success") {
        // User picked an image
        const uri = result.uri;
        setDocumentType(uri.split(".")[uri.split(".").length - 1]);
        setDocument(uri);
        setMimeType(result.mimeType);
        Toast.show({
          type: "success",
          text1: "file added successfully",
        });
        setErrors({
          name: undefined,
          document: undefined,
          checkBox: undefined,
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "something went wrong",
      });
    }
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
      var storageRef = storage().ref();

      storageRef
        .child(`clubs/forms/uploaded/${imageFileName}`)
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

  const handleSubmit = () => {
    let errors = [...errors];

    if (!name.trim()) errors.name = "Please enter your club's name";
    if (!document && step === "step2")
      errors.document = "Please upload your FPF form.";
    if (!isChecked && step === "step2")
      errors.checkBox = "Please acknowledge the above.";

    if (!errors.name) {
      if (step === "step1") {
        setStep("step2");
        return;
      }
    }

    if (!errors.name && !errors.document && !errors.checkBox) {
      //create a new club
      //first add to clubs
      //then add to clubs overview (campus admin will get data from here)

      let index = user.clubs.findIndex(
        (club) => club.approval === "pending" && club.createdBy === user.userId
      );

      if (index !== -1) {
        Toast.show({
          type: "error",
          text1: "you can only create a request for one club at a time.",
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      errors.name = "";
      errors.Checkbox = "";
      errors.document = "";

      const memberID = Crypto.randomUUID();
      let clubID = "";
      const createdAt = new Date();
      const createdBy = user.userId;

      const nameForDoc = Crypto.randomUUID();
      let documentName = `${nameForDoc}.${documentType}`;
      let firebasePath = `clubs/forms/uploaded/${documentName}`;

      uriToBlob(document)
        .then((blob) => {
          return uploadToFirebase(blob, documentName);
        })
        .then((snapshot) => {
          return storage().ref(firebasePath).getDownloadURL();
        })
        .then((url) => {
          let clubsData = {
            clubID: "", //get it later after adding
            name,
            image:
              "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fclubs_default.jpeg?alt=media&token=8a9c42e0-d937-4389-804f-9fd6953644ac&_gl=1*1c0ck02*_ga*NTQ3Njc0ODExLjE2ODA3MTQ2Mjg.*_ga_CW55HF8NVT*MTY5ODI5NzM4MS4xOTUuMS4xNjk4MzAwMDYzLjU4LjAuMA..",
            gallery: false,
            events: false,
            details: {
              schedule: "",
              fees: "",
              misc: "",
            },
            numberOfMembers: 1,
            roles: {
              president: {
                memberID, //to be generated
                userID: createdBy,
                alternateName: "",
                name: "president",
              },
              vicepresident: {
                memberID: "", //to be generated
                userID: "",
                alternateName: "",
                name: "vice president",
              },
              secretary: {
                memberID: "", //to be generated
                userID: "",
                alternateName: "",
                name: "secretary",
              },
              treasurer: {
                memberID: "", //to be generated
                userID: "",
                alternateName: "",
                name: "treasurer",
              },
              member: {
                details: [],
                alternateName: "",
                name: "member",
              },
            },
            approval: "pending",
            approvalText:
              state.campus.sa === ""
                ? "pending approval from Admin"
                : `pending approval from ${state.campus.saName}`,
            reviewLevel: state.campus.sa === "" ? "admin" : "sa",
            saFeedback: "",
            saApproval: "",
            rejectionReason: "",
            status: "inactive",
            membersRequests: [],
            createdAt,
            createdBy,
            campusID: state.campus.campusID,
            fpfForms: [url],
          };

          let eventData = {
            events: [],
            clubID: "",
            createdBy,
            campusID: state.campus.campusID,
          };

          let clubMembers = {
            campusID: state.campus.campusID,
            clubID: "",
            members: [
              {
                name: user.name,
                phone_number: user.phone_number,
                email: user.email,
                intake: user.intake,
                department: user.department,
                memberID, //to be generated
                userID: createdBy,
                role: "president", //by default
                createdAt,
                profileImage: user.profileImage,
                bio: "",
              },
            ],
          };

          let galleryData = {
            gallery: [],
            clubID: "",
            createdBy,
            campusID: state.campus.campusID,
          };

          let clubsOverviewData = {
            name,
            image:
              "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fclubs_default.jpeg?alt=media&token=8a9c42e0-d937-4389-804f-9fd6953644ac&_gl=1*1c0ck02*_ga*NTQ3Njc0ODExLjE2ODA3MTQ2Mjg.*_ga_CW55HF8NVT*MTY5ODI5NzM4MS4xOTUuMS4xNjk4MzAwMDYzLjU4LjAuMA..",
            clubID: "", //to be added later
            approval: "pending",
            approvalText:
              state.campus.sa === ""
                ? "pending approval from Admin"
                : `pending approval from ${state.campus.saName}`,
            reviewLevel: state.campus.sa === "" ? "admin" : "sa",
            saFeedback: "",
            saApproval: "",
            rejectionReason: "",
            status: "inactive",
            createdBy,
            campusID: state.campus.campusID,
          };

          let userData = {
            clubID: "",
            name,
            memberID,
            role: "president",
            approval: "approved",
            createdBy,
            createdAt,
          };

          db.collection("clubs")
            .add(clubsData)
            .then((data) => {
              clubID = data.id;
              return db.collection("clubs").doc(clubID).update({ clubID });
            })
            .then(() => {
              clubsOverviewData.clubID = clubID;
              eventData.clubID = clubID;
              galleryData.clubID = clubID;
              clubMembers.clubID = clubID;

              //first check if the campusID is in clubsOverview collection
              db.collection("clubsOverview")
                .doc(state.campus.campusID)
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

                  db.collection("users")
                    .doc(user.userId)
                    .get()
                    .then((doc) => {
                      let temp = doc.data().clubs;
                      temp.push(userData);

                      return db
                        .doc(`/users/${user.userId}`)
                        .update({ clubs: [...temp] });
                    })
                    .then(() => {
                      //create event details
                      return db
                        .doc(`/events/${eventData.clubID}`)
                        .set(eventData);
                    })
                    .then(() => {
                      //create gallery details
                      return db
                        .doc(`/gallery/${galleryData.clubID}`)
                        .set(galleryData);
                    })
                    .then(() => {
                      //add members details
                      return db
                        .doc(`/clubMembers/${clubMembers.clubID}`)
                        .set(clubMembers);
                    })
                    .then(() => {
                      setLoading(false);

                      //after creating, immediately append to user's local state list of clubs overview
                      //after creating, add to local states yours list of clubs

                      dispatch({ type: ADD_USER_CLUB, payload: userData });

                      // setSuccessMessage(
                      //   "Request submitted! Stay tuned for updates"
                      // );
                      dispatch(
                        sendAdminNotification(
                          "createAClub",
                          clubsData.name,
                          state.campus.sa,
                          state.campus.saName,
                          state.campus.campusID
                        )
                      );
                      Toast.show({
                        type: "success",
                        text1: "Request submitted! Stay tuned for updates",
                      });
                      navigation.goBack();
                      setErrors({
                        name: undefined,
                        document: undefined,
                        checkBox: undefined,
                      });
                    });
                });
            })
            .catch((error) => {
              setLoading(false);
              console.error(error);
              dispatch({ type: STOP_LOADING_DATA });
            });
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
          dispatch({ type: STOP_LOADING_DATA });
        });
    }

    setErrors(errors);
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.navigate("Clubs");
  };

  let clubName = (
    <>
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
    </>
  );

  let fpf = (
    <>
      <View
        style={{
          flexDirection: "row",
          marginTop: pixelSizeVertical(-4),
        }}
      >
        <Text
          style={{
            flexGrow: 1,
            flexShrink: 1,
            lineHeight: 20,
          }}
        >
          <Text
            style={{
              fontSize: fontPixel(16),
              fontWeight: "400",
              color: "#DFE5F8",
            }}
          >
            Download and complete the{" "}
          </Text>

          <Text
            style={{
              fontSize: fontPixel(16),
              fontWeight: "500",
              color: "#07BEB8",
            }}
            onPress={async () => await WebBrowser.openBrowserAsync(FPFUrl)}
          >
            Affiliate Future Annual Planning form
          </Text>
          <Text
            style={{
              fontSize: fontPixel(16),
              fontWeight: "400",
              color: "#DFE5F8",
            }}
          >
            , then submit it below.
          </Text>
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: pixelSizeVertical(16),
        }}
      >
        <Pressable onPress={pickDocument} style={styles.imagePicker}>
          <Text
            style={{
              fontSize: fontPixel(16),
              fontWeight: "400",
              color: "#DFE5F8",
            }}
          >
            upload FPF form
          </Text>
        </Pressable>
      </View>
      {errors.document ? (
        <Text
          style={{
            marginTop: pixelSizeVertical(8),
            marginBottom: pixelSizeVertical(8),
            fontSize: fontPixel(12),
            fontWeight: "400",
            color: "#a3222d",
            textAlign: "left",
            width: "100%",
          }}
        >
          {errors.document}
        </Text>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          paddingRight: pixelSizeHorizontal(16),
          paddingLeft: pixelSizeHorizontal(16),
          marginTop: pixelSizeVertical(16),
        }}
      >
        <Checkbox
          style={{
            marginRight: pixelSizeHorizontal(8),
            marginTop: pixelSizeVertical(8),
          }}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? "#07BEB8" : undefined}
        />
        <Text
          style={{
            fontSize: fontPixel(12),
            fontWeight: "400",
            color: "#C6CDE2",
          }}
        >
          I acknowledge that by submitting this request I, as the president of
          the club have completed the Affiliate Future Annual Planning form and
          that all the information filled in is correct.
        </Text>
      </View>
      {errors.checkBox ? (
        <Text
          style={{
            marginTop: pixelSizeVertical(8),
            marginBottom: pixelSizeVertical(8),
            fontSize: fontPixel(12),
            fontWeight: "400",
            color: "#a3222d",
            textAlign: "left",
            width: "100%",
          }}
        >
          {errors.checkBox}
        </Text>
      ) : null}
    </>
  );

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
        {step === "step1" ? (
          <Text style={styles.disclaimer}>
            Your club has to be approved by the college before you can continue
            adding details and list it publicly.
          </Text>
        ) : null}
      </View>
      {step === "step1" ? clubName : null}
      {step === "step2" ? fpf : null}
      <Pressable
        style={loading ? styles.loginButtonDisabled : styles.loginButton}
        onPress={handleSubmit}
      >
        <Text
          style={
            loading ? styles.loginButtonLoadingText : styles.loginButtonText
          }
        >
          {step === "step2"
            ? loading
              ? "creating..."
              : "create request"
            : "next"}
        </Text>
      </Pressable>
      {step === "step2" ? (
        <Pressable
          onPress={() => {
            setStep("step1");
          }}
        >
          <Text style={styles.secondaryButton}>back</Text>
        </Pressable>
      ) : null}
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
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
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
  imagePicker: {
    backgroundColor: "#232F52",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    marginBottom: pixelSizeVertical(8),
    borderRadius: 5,
  },
});
