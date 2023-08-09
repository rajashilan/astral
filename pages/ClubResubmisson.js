import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TextInput,
} from "react-native";
import club4 from "../assets/club4.png";
import member1 from "../assets/member1.png";
import member2 from "../assets/member2.png";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";
import { Image } from "expo-image";

import IosHeight from "../components/IosHeight";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import { firebase } from "../src/firebase/config";

const db = firebase.firestore();
import { useDispatch, useSelector } from "react-redux";

const { width } = Dimensions.get("window");

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

import { ScrollView } from "react-native-gesture-handler";

export default function ClubResubmission({ navigation, route }) {
  const { club } = route.params;
  const dispatch = useDispatch();
  const state = useSelector((state) => state.data);
  const user = useSelector((state) => state.user.credentials);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: undefined,
  });

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.navigate("Clubs");
  };

  const handleSubmit = () => {
    //update the club's name
    //update the club's approval to pending

    //what do we need to update locally?
    //club's name and status
    //can dispatch all at once
    //for data reducer (clubs and clubsOv)

    //ignore redux first
    //user can refresh to see latest updates

    let errors = [...errors];

    if (!name.trim()) errors.name = "Please enter your club's new name";

    if (!errors.name) {
      setLoading(true);
      errors.name = "";

      //update in users
      db.doc(`/users/${user.userId}`)
        .get()
        .then((doc) => {
          let temp = [...doc.data().clubs];
          let index = temp.findIndex(
            (tempClub) => tempClub.clubID === club.clubID
          );
          temp[index].name = name;
          temp[index].approval = "pending";

          return db.doc(`/users/${user.userId}`).update({ clubs: [...temp] });
        })
        .then(() => {
          //update in clubsOverview
          return db.doc(`/clubsOverview/${club.campusID}`).get();
        })
        .then((doc) => {
          let temp = [...doc.data().clubs];
          let index = temp.findIndex(
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
    }

    setErrors(errors);
  };

  const handleWithdraw = () => {
    //delete the club using the clubID from user clubs, clubsOverview, and clubs
    //delete data locally in redux

    setLoading(true);

    db.doc(`/users/${user.userId}`)
      .get()
      .then((doc) => {
        let temp = [...doc.data().clubs];
        let index = temp.findIndex(
          (tempClub) => tempClub.clubID === club.clubID
        );
        temp.splice(index, 1);

        return db.doc(`/users/${user.userId}`).update({ clubs: [...temp] });
      })
      .then(() => {
        //update in clubsOverview
        return db.doc(`/clubsOverview/${club.campusID}`).get();
      })
      .then((doc) => {
        let temp = [...doc.data().clubs];
        let index = temp.findIndex(
          (tempClub) => tempClub.clubID === club.clubID
        );
        temp.splice(index, 1);

        return db
          .doc(`/clubsOverview/${club.campusID}`)
          .update({ clubs: [...temp] });
      })
      .then(() => {
        //update in clubs
        return db.doc(`/clubs/${club.clubID}`).delete();
      })
      .then(() => {
        //delete from events
        return db.doc(`/events/${club.clubID}`).delete();
      })
      .then(() => {
        //delete from gallery
        return db.doc(`/gallery/${club.clubID}`).delete();
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

      <ScrollView
        style={StyleSheet.create({
          flex: 1,
          marginTop: pixelSizeVertical(10),
        })}
      >
        <Text style={styles.header}>{club.name}</Text>

        <Text style={styles.rejectionReason}>{club.rejectionReason}</Text>

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
            {loading ? "resubmitting..." : "resubmit"}
          </Text>
        </Pressable>
        <Pressable onPress={() => setShowWithdrawModal(!showWithdrawModal)}>
          <Text style={styles.withdrawButton}>withdraw</Text>
        </Pressable>
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

      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  header: {
    fontSize: fontPixel(34),
    fontWeight: "500",
    color: "#DFE5F8",
  },
  rejectionReason: {
    fontSize: fontPixel(20),
    fontWeight: "400",
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
  loginButtonLoadingText: {
    fontSize: fontPixel(22),
    fontWeight: "400",
    color: "#DFE5F8",
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
  headerContainer: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(16),
    flexDirection: "row",
    justifyContent: "space-between",
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
  withdrawButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
  },
  headerContainerShowMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});
