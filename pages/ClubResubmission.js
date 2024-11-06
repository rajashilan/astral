import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import Checkbox from "expo-checkbox";
import * as Crypto from "expo-crypto";
import * as DocumentPicker from "expo-document-picker";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  getAClub,
  sendAdminNotification,
} from "../src/redux/actions/dataActions";
import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";
import EmptyView from "../components/EmptyView";
import CustomTextInput from "../components/CustomTextInput";

const { width } = Dimensions.get("window");

const db = firestore();

export default function ClubResubmission({ navigation, route }) {
  const { clubID } = route.params;

  const user = useSelector((state) => state.user.credentials);
  const club = useSelector((state) => state.data.clubData.club);
  const state = useSelector((state) => state.data);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [successMessage] = useState("");
  const [errors, setErrors] = useState({
    name: undefined,
    document: undefined,
    checkBox: undefined,
  });
  const [document, setDocument] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [submittedDocument, setSubmittedDocument] = useState(null);
  const [isChecked, setChecked] = useState(false);

  const [step, setStep] = useState("step1");

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const clubCreationDocName = state.campus.clubCreationDocName;

  useEffect(() => {
    dispatch(getAClub(clubID, user.userId));
  }, []);

  useEffect(() => {
    setName(club.name);
    if (club.clubCreationDocs) {
      setDocument(club.clubCreationDocs[0]);
      setSubmittedDocument(club.clubCreationDocs[0]);
    }
  }, [club]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ], // Specify the type of document you want to pick (e.g., PDF)
      });

      if (!result.canceled) {
        // User picked an image
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
        .child(`clubs/forms/reuploaded/${club.clubID}/${imageFileName}`)
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

    if (!name.trim()) errors.name = "Please enter your club's name";
    if (!document && step === "step2")
      errors.document = `Please upload ${clubCreationDocName}.`;
    if (!isChecked && step === "step2")
      errors.checkBox = "Please acknowledge the above.";

    if (!errors.name) {
      if (step === "step1") {
        setStep("step2");
        return;
      }
    }

    if (!errors.name && !errors.document && !errors.checkBox) {
      //update the club's name
      //update the club's approval to pending
      //check if document has changed, if has changed, upload the new documen

      setLoading(true);
      errors.name = "";
      errors.Checkbox = "";
      errors.document = "";

      if (submittedDocument === document) {
        //update in users
        db.collection("users")
          .doc(user.userId)
          .get()
          .then((doc) => {
            const temp = [...doc.data().clubs];
            const index = temp.findIndex(
              (tempClub) => tempClub.clubID === club.clubID
            );
            temp[index].name = name;
            temp[index].approval = "pending";

            return db
              .collection("users")
              .doc(user.userId)
              .update({ clubs: [...temp] });
          })
          .then(() => {
            //update in clubsOverview
            return db.collection("clubsOverview").doc(club.campusID).get();
          })
          .then((doc) => {
            const temp = [...doc.data().clubs];
            const index = temp.findIndex(
              (tempClub) => tempClub.clubID === club.clubID
            );
            temp[index].name = name;
            temp[index].approval = "pending";

            return db
              .collection("clubsOverview")
              .doc(club.campusID)
              .update({ clubs: [...temp] });
          })
          .then(() => {
            return db
              .collection("clubs")
              .doc(club.clubID)
              .update({ name, approval: "pending" });
          })
          .then(() => {
            setLoading(false);
            Toast.show({
              type: "success",
              text1: "Club resubmitted successfully",
            });
            navigation.replace("Clubs");
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      } else {
        if (document) {
          const nameForDoc = Crypto.randomUUID();
          const documentName = `${nameForDoc}.${documentType}`;
          const firebasePath = `clubs/forms/reuploaded/${club.clubID}/${documentName}`;

          uriToBlob(document)
            .then((blob) => {
              return uploadToFirebase(blob, documentName);
            })
            .then((snapshot) => {
              return storage().ref(firebasePath).getDownloadURL();
            })
            .then((url) => {
              db.collection("users")
                .doc(user.userId)
                .get()
                .then((doc) => {
                  const temp = [...doc.data().clubs];
                  const index = temp.findIndex(
                    (tempClub) => tempClub.clubID === club.clubID
                  );
                  temp[index].name = name;
                  temp[index].approval = "pending";

                  return db
                    .collection("users")
                    .doc(user.userId)
                    .update({ clubs: [...temp] });
                })
                .then(() => {
                  //update in clubsOverview
                  return db
                    .collection("clubsOverview")
                    .doc(club.campusID)
                    .get();
                })
                .then((doc) => {
                  const temp = [...doc.data().clubs];
                  const index = temp.findIndex(
                    (tempClub) => tempClub.clubID === club.clubID
                  );
                  temp[index].name = name;
                  temp[index].approval = "pending";

                  return db
                    .collection("clubsOverview")
                    .doc(club.campusID)
                    .update({ clubs: [...temp] });
                })
                .then(() => {
                  return db
                    .collection("clubs")
                    .doc(club.clubID)
                    .update({
                      name,
                      approval: "pending",
                      clubCreationDocs: [url],
                    });
                })
                .then(() => {
                  setLoading(false);
                  Toast.show({
                    type: "success",
                    text1: "Club resubmitted successfully",
                  });
                  navigation.replace("Clubs");
                })
                .catch((error) => {
                  console.error(error);
                  setLoading(false);
                });
            })
            .catch((error) => {
              console.error(error);
              setLoading(false);
            });
        }
      }
      dispatch(
        sendAdminNotification("clubResubmission", name, "", "", club.campusID)
      );
    }

    setErrors(errors);
  };

  const showWithdrawAlert = () => {
    Alert.alert(
      "Withdraw submission",
      `Are you sure to withdraw this submission?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Withdraw",
          onPress: () => handleWithdraw(),
          style: "destructive",
        },
      ]
    );
  };

  const handleWithdraw = () => {
    //delete the club using the clubID from user clubs, clubsOverview, and clubs
    //delete data locally in redux

    setLoading(true);

    db.collection("users")
      .doc(user.userId)
      .get()
      .then((doc) => {
        const temp = [...doc.data().clubs];
        const index = temp.findIndex(
          (tempClub) => tempClub.clubID === club.clubID
        );
        temp.splice(index, 1);

        return db
          .collection("users")
          .doc(user.userId)
          .update({ clubs: [...temp] });
      })
      .then(() => {
        //update in clubsOverview
        return db.collection("clubsOverview").doc(club.campusID).get();
      })
      .then((doc) => {
        const temp = [...doc.data().clubs];
        const index = temp.findIndex(
          (tempClub) => tempClub.clubID === club.clubID
        );
        temp.splice(index, 1);

        return db
          .collection("clubsOverview")
          .doc(club.campusID)
          .update({ clubs: [...temp] });
      })
      .then(() => {
        //update in clubs
        return db.collection("clubs").doc(club.clubID).delete();
      })
      .then(() => {
        //delete from events
        return db.collection("events").doc(club.clubID).delete();
      })
      .then(() => {
        //delete from gallery
        return db.collection("gallery").doc(club.clubID).delete();
      })
      .then(() => {
        //delete from clubMembers
        return db.collection("clubMembers").doc(club.clubID).delete();
      })
      .then(() => {
        setLoading(false);
        Toast.show({
          type: "success",
          text1: "Club application withdrawn successfully",
        });
        navigation.replace("Clubs");
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.replace("Clubs");
  };

  const clubName = (
    <>
      <CustomTextInput
        placeholder="Enter your club's name"
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
            Download and view your{" "}
          </Text>

          <Text
            style={{
              fontSize: fontPixel(16),
              fontWeight: "500",
              color: "#07BEB8",
            }}
            onPress={async () =>
              await WebBrowser.openBrowserAsync(submittedDocument)
            }
          >
            previously submitted {clubCreationDocName}
          </Text>
          <Text
            style={{
              fontSize: fontPixel(16),
              fontWeight: "400",
              color: "#DFE5F8",
            }}
          >
            .
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
            {document ? "upload new form" : "upload form"}
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
        <Header header={club.name} />
        {step === "step1" ? (
          <Text style={styles.disclaimer}>{club.rejectionReason}</Text>
        ) : null}
      </View>
      {step === "step1" ? clubName : null}
      {step === "step2" ? stepClubCreationDoc : null}
      <PrimaryButton
        onPress={handleSubmit}
        loading={loading}
        text={step === "step2" ? "resubmit" : "next"}
      />
      {step === "step2" && !loading ? (
        <Pressable
          onPress={() => {
            setStep("step1");
          }}
        >
          <Text style={styles.secondaryButton}>back</Text>
        </Pressable>
      ) : step === "step1" && !loading ? (
        <Pressable onPress={() => showWithdrawAlert()}>
          <Text style={styles.secondaryButton}>withdraw</Text>
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
          currentPage="clubspages"
          navigation={navigation}
        />
      </Modal>
      <EmptyView />
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
    marginTop: pixelSizeVertical(-8),
    fontSize: fontPixel(18),
    fontWeight: "400",
    color: "#C8A427",
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
