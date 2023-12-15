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
  TextInput,
  View,
  Dimensions,
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
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";

const { width } = Dimensions.get("window");

const db = firestore();

export default function ClubResubmission({ navigation, route }) {
  const { clubID } = route.params;

  const user = useSelector((state) => state.user.credentials);
  const club = useSelector((state) => state.data.clubData.club);
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

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    dispatch(getAClub(clubID, user.userId));
  }, []);

  useEffect(() => {
    setName(club.name);
    if (club.fpfForms) {
      setDocument(club.fpfForms[0]);
      setSubmittedDocument(club.fpfForms[0]);
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

      if (result.type === "success") {
        // User picked an image
        const uri = result.uri;
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
    const errors = [...errors];

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
              .doc(`/clubsOverview/${club.campusID}`)
              .update({ clubs: [...temp] });
          })
          .then(() => {
            return db
              .doc(`/clubs/${club.clubID}`)
              .update({ name, approval: "pending" });
          })
          .then(() => {
            setLoading(false);
            Toast.show({
              type: "success",
              text1: "Club resubmitted successfully",
            });
            navigation.navigate("Clubs");
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      } else {
        if (document) {
          const nameForDoc = Crypto.randomUUID();
          const documentName = `${nameForDoc}.${documentType}`;
          const firebasePath = `clubs/forms/uploaded/${documentName}`;
          console.log(documentName);

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
                    .doc(`/users/${user.userId}`)
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
                    .doc(`/clubsOverview/${club.campusID}`)
                    .update({ clubs: [...temp] });
                })
                .then(() => {
                  return db
                    .doc(`/clubs/${club.clubID}`)
                    .update({ name, approval: "pending", fpfForms: [url] });
                })
                .then(() => {
                  setLoading(false);
                  Toast.show({
                    type: "success",
                    text1: "Club resubmitted successfully",
                  });
                  navigation.navigate("Clubs");
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
          .doc(`/clubsOverview/${club.campusID}`)
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
        navigation.navigate("Clubs");
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
    navigation.navigate("Clubs");
  };

  const clubName = (
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

  const fpf = (
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
            previously submitted FPF form
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
            {document ? "upload new FPF form" : "upload FPF form"}
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
              ? "resubmitting..."
              : "resubmit"
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
          currentPage="clubs"
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
            Are you sure to withdraw your application?
          </Text>
          <Pressable
            style={loading ? styles.loginButtonDisabled : styles.loginButton}
            onPress={handleWithdraw}
          >
            <Text
              style={
                loading ? styles.loginButtonLoadingText : styles.loginButtonText
              }
            >
              {loading ? "withdrawing..." : "withdraw"}
            </Text>
          </Pressable>
          <Pressable onPress={() => setShowWithdrawModal(!showWithdrawModal)}>
            <Text style={styles.withdrawButton}>cancel</Text>
          </Pressable>
        </View>
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
