import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Checkbox from "expo-checkbox";
import * as Crypto from "expo-crypto";
import * as DocumentPicker from "expo-document-picker";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
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
import { sendAdminNotification } from "../src/redux/actions/dataActions";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";
import CustomTextInput from "../components/CustomTextInput";

const { width } = Dimensions.get("window");

const db = firestore();

export default function ClubRenewal({ navigation, route }) {
  const user = useSelector((state) => state.user.credentials);
  const state = useSelector((state) => state.data);
  const members = useSelector((state) => state.data.clubData.members);
  const club = useSelector((state) => state.data.clubData.club);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [successMessage] = useState("");
  const [errors, setErrors] = useState({
    document: undefined,
    checkBox: undefined,
  });
  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [isChecked, setChecked] = useState(false);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const clubCreationDoc = state.campus.clubRenewalDoc;
  const clubCreationDocName = state.campus.clubRenewalDocName;

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });
      if (!result.canceled) {
        // user picked an image
        const uri = result.assets[0].uri;
        setDocumentType(uri.split(".")[uri.split(".").length - 1]);
        setDocument(uri);
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

  const uploadToFirebase = (blob, imageFileName) => {
    return new Promise((resolve, reject) => {
      const storageRef = storage().ref();

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
    const errors = { ...errors };

    if (!document) errors.document = `Please upload ${clubCreationDocName}.`;
    if (!isChecked) errors.checkBox = "Please acknowledge the above.";

    if (!errors.document && !errors.checkBox) {
      setLoading(true);
      errors.Checkbox = "";
      errors.document = "";

      const nameForDoc = Crypto.randomUUID();
      const documentName = `${nameForDoc}.${documentType}`;
      const firebasePath = `clubs/forms/uploaded/${documentName}`;

      uriToBlob(document)
        .then((blob) => {
          return uploadToFirebase(blob, documentName);
        })
        .then((snapshot) => {
          return storage().ref(firebasePath).getDownloadURL();
        })
        .then((url) => {
          //push url to clubCreationDocs in the clubs document
          db.collection("clubs")
            .doc(club.clubID)
            .get()
            .then((doc) => {
              let clubCreationDocs = doc.data().clubCreationDocs;
              clubCreationDocs.push(url);

              return db
                .collection("clubs")
                .doc(club.clubID)
                .update({ clubCreationDocs });
            });
        })
        .then(() => {
          dispatch(
            sendAdminNotification(
              "clubRenewal",
              club.name,
              state.campus.sa,
              state.campus.saName,
              state.campus.campusID
            )
          );
          Toast.show({
            type: "success",
            text1: "Renewal submitted successfully.",
          });
          setErrors({
            document: undefined,
            checkBox: undefined,
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    }

    setErrors(errors);
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const stepClubCreationDoc = (
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
            onPress={async () =>
              await WebBrowser.openBrowserAsync(clubCreationDoc)
            }
          >
            {clubCreationDocName}
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
            upload
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
            color: "#ed3444",
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
          the club have completed the {clubCreationDocName} and that all the
          information filled in is correct.
        </Text>
      </View>
      {errors.checkBox ? (
        <Text
          style={{
            marginTop: pixelSizeVertical(8),
            marginBottom: pixelSizeVertical(8),
            fontSize: fontPixel(12),
            fontWeight: "400",
            color: "#ed3444",
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
      <View style={{ width: "100%" }}>
        <Header header="club renewal" />
      </View>
      {stepClubCreationDoc}
      <PrimaryButton loading={loading} onPress={handleSubmit} text={"submit"} />
      <Pressable
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={styles.secondaryButton}>back</Text>
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
          currentPage="clubspages"
          navigation={navigation}
        />
      </Modal>
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </KeyboardAvoidingView>
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
  text: {
    color: "#fff",
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
    textAlign: "left",
    width: "100%",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
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
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(30),
  },
  headerContainerShowMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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
