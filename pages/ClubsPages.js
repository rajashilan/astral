import * as Crypto from "expo-crypto";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import Animated, {
  FadeIn,
  FadeOut,
  FadeInUp,
  FadeOutUp,
} from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import hamburgerIcon from "../assets/hamburger_icon.png";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  getAClub,
  joinClub,
  sendPushNotification,
  setClubFirstTimeToFalse,
} from "../src/redux/actions/dataActions";
import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
  widthPixel,
  heightPixel,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import PrimaryButton from "../components/PrimaryButton";

import { RESET_CLUB_DATA } from "../src/redux/type";
import Loader from "../components/Loader";
import RedDot from "../assets/RedDot";
import { setClubMemberFirstTimeToFalse } from "../src/redux/actions/userActions";
import PostsAdapter from "../components/Posts/PostsAdapter";
import EmptyView from "../components/EmptyView";
import CreateAPostModal from "../components/CreateAPostModal";

const { width, height } = Dimensions.get("window");

const context = "club";

export default function ClubsPages({ navigation, route }) {
  const { clubID } = route.params;

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.credentials);
  const data = useSelector((state) => state.data.clubData.club);
  const posts = useSelector((state) => state.data.clubData.posts);
  const campusID = useSelector((state) => state.data.campus.campusID);
  const loading = useSelector((state) => state.data.loading);
  const UIloading = useSelector((state) => state.UI.loading);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const members = useSelector((state) => state.data.clubData.members);
  const [hasRequested, setHasRequested] = useState(false);
  const [membersRequests, setMembersRequests] = useState([]);
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const [showAgreementPopUp, setShowAgreementPopUp] = useState(false);
  const [canBeActivated, setCanBeActivated] = useState(false);
  const [isUserFirstTime, setIsUserFirstTime] = useState(false);
  const [isClubFirstTime, setIsClubFirstTime] = useState(false);
  const [showCreateAPostModal, setShowCreateAPostModal] = useState(false);

  const numberOfMembers =
    members.length === 1
      ? `${members.length} member`
      : `${members.length} members`;

  const [show, setShow] = useState(true);

  // const posts = [
  //   {
  //     postID: "1",
  //     text: "Hello everybody welcome to my youtube channel",
  //     type: "photo", //photo, file, text, poll, ?event?
  //     createdBy: "1",
  //     createdByUsername: "rajashilan",
  //     createdByRole: "president",
  //     createdAt: "2024-09-25T11:20:18.153Z",
  //     clubID: "1",
  //     clubName: "Computer Science Club",
  //     clubImageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fgallery%2Fphotos%2F1Z0lUDASLWZMwiJK7HtT%2Fa5450289-3f81-4175-b66a-1158b7102cb0.jpg?alt=media&token=c5ceb722-74a0-4dc8-b152-6c2b346d886e",
  //     campusID: "1",
  //     photos: [
  //       "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fgallery%2Fphotos%2F1Z0lUDASLWZMwiJK7HtT%2F180c02d6-d20c-4360-a258-182c261c5a0d.jpg?alt=media&token=76adef5d-3969-4c5b-b797-25b1ec4ef5a4",

  //       "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fgallery%2Fphotos%2F1Z0lUDASLWZMwiJK7HtT%2Fa5450289-3f81-4175-b66a-1158b7102cb0.jpg?alt=media&token=c5ceb722-74a0-4dc8-b152-6c2b346d886e",
  //       "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fgallery%2Fphotos%2F1Z0lUDASLWZMwiJK7HtT%2F620f06be-b62d-4eb3-aa6a-1bdeca51e64a.jpg?alt=media&token=ee373f91-e59b-458d-b309-d18d5b172dca",
  //     ],
  //     visibility: "public",
  //   },
  //   {
  //     postID: "3",
  //     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  //     type: "file", //photo, file, text, poll, ?event?
  //     createdBy: "1",
  //     createdByUsername: "rajashilan",
  //     createdAt: "2024-09-25T11:20:18.153Z",
  //     createdByRole: "president",
  //     clubID: "1",
  //     clubImageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fgallery%2Fphotos%2F1Z0lUDASLWZMwiJK7HtT%2Fa5450289-3f81-4175-b66a-1158b7102cb0.jpg?alt=media&token=c5ceb722-74a0-4dc8-b152-6c2b346d886e",
  //     clubName:
  //       "Engineering and Computing Club for INTI International College Penang",
  //     campusID: "1",
  //     file: {
  //       name: "internal_testers_testers_export.csv",
  //       url: "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/orientation%2Fpages%2Ffiles%2Fhb75RnF3COn7w3JQeoF6%2Fe99f06f47d61f9152115.csv?alt=media&token=db99d18791db94177ca9fb077d3568efab06b2a6",
  //     },
  //     visibility: "public",
  //   },
  //   {
  //     postID: "2",
  //     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
  //     type: "photo", //photo, file, text, poll, ?event?
  //     createdBy: "1",
  //     createdByUsername: "rajashilan",
  //     createdAt: "2024-09-25T11:20:18.153Z",
  //     createdByRole: "president",
  //     clubID: "1",
  //     clubImageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fgallery%2Fphotos%2F1Z0lUDASLWZMwiJK7HtT%2Fa5450289-3f81-4175-b66a-1158b7102cb0.jpg?alt=media&token=c5ceb722-74a0-4dc8-b152-6c2b346d886e",
  //     clubName:
  //       "Engineering and Computing Club for INTI International College Penang",
  //     campusID: "1",
  //     photos: [
  //       "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fgallery%2Fphotos%2F1Z0lUDASLWZMwiJK7HtT%2F620f06be-b62d-4eb3-aa6a-1bdeca51e64a.jpg?alt=media&token=ee373f91-e59b-458d-b309-d18d5b172dca",
  //     ],
  //     visibility: "public",
  //   },
  //   {
  //     postID: "2",
  //     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
  //     type: "text", //photo, file, text, poll, ?event?
  //     createdBy: "1",
  //     createdByUsername: "rajashilan",
  //     createdAt: "2024-09-25T11:20:18.153Z",
  //     createdByRole: "president",
  //     clubID: "1",
  //     clubImageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fgallery%2Fphotos%2F1Z0lUDASLWZMwiJK7HtT%2Fa5450289-3f81-4175-b66a-1158b7102cb0.jpg?alt=media&token=c5ceb722-74a0-4dc8-b152-6c2b346d886e",
  //     clubName:
  //       "Engineering and Computing Club for INTI International College Penang",
  //     campusID: "1",
  //     visibility: "public",
  //   },
  //   {
  //     postID: "5",
  //     text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris",
  //     type: "poll", //photo, file, text, poll, ?event?
  //     createdBy: "1",
  //     createdByUsername: "rajashilan",
  //     createdAt: "2024-09-25T11:20:18.153Z",
  //     createdByRole: "president",
  //     clubID: "1",
  //     clubImageUrl:
  //       "https://firebasestorage.googleapis.com/v0/b/astral-d3ff5.appspot.com/o/clubs%2Fgallery%2Fphotos%2F1Z0lUDASLWZMwiJK7HtT%2Fa5450289-3f81-4175-b66a-1158b7102cb0.jpg?alt=media&token=c5ceb722-74a0-4dc8-b152-6c2b346d886e",
  //     clubName:
  //       "Engineering and Computing Club for INTI International College Penang",
  //     campusID: "1",
  //     poll: {
  //       options: [
  //         {
  //           optionID: 0,
  //           text: "Get KFC from FoodPanda and chill in class.",
  //           votes: 5,
  //         },
  //         {
  //           optionID: 1,
  //           text: "Go lepak at Nasi Kandar Kayu",
  //           votes: 3,
  //         },
  //         {
  //           optionID: 2,
  //           text: "Go for shopping at Gurney Plaza",
  //           votes: 7,
  //         },
  //         {
  //           optionID: 3,
  //           text: "Maybe just save the money and use for something else and then later can consider?",
  //           votes: 2,
  //         },
  //       ],
  //       votes: {
  //         1234: {
  //           optionID: 0,
  //           createdAt: "2024-09-25T11:20:18.153Z",
  //         },
  //         2531: {
  //           optionID: 1,
  //           createdAt: "2024-09-25T11:20:18.153Z",
  //         },
  //       },
  //       createdAt: "2024-11-01T11:20:18.153Z",
  //       expiresAt: "2024-11-03T11:20:18.153Z",
  //     },
  //     visibility: "public",
  //   },
  // ];

  const [tabs] = useState(["posts", "members", "events", "details", "extra"]);

  const tabNavigation = (selectedTab) => {
    if (selectedTab === "members") {
      navigation.navigate("ClubsMembers");
    } else if (selectedTab === "events") {
      navigation.navigate("ClubsEvents");
    } else if (selectedTab === "details") {
      navigation.navigate("ClubsDetails");
    }
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    dispatch(getAClub(clubID, user.userId));
    return () => {
      dispatch({ type: RESET_CLUB_DATA });
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(data)) {
      setMembersRequests(data.membersRequests);

      if (
        data.gallery &&
        data.events &&
        data.details.schedule !== "" &&
        data.details.fees !== "" &&
        data.status === "inactive"
      ) {
        setCanBeActivated(true);
      } else {
        setCanBeActivated(false);
      }

      const temp = [...data.membersRequests];
      const index = temp.findIndex((member) => member.userID === user.userId);
      if (index !== -1)
        if (temp[index].approval !== "rejected") setHasRequested(true);

      //check if its the first time the club page is being visited by the president
      //set isClubFirstTime is data.isFirstTime and current member is president, just in case
      if (data.isFirstTime && currentMember.role === "president") {
        dispatch(setClubFirstTimeToFalse(clubID));
        setIsClubFirstTime(true);
        console.log("Setting club is first time to false");
      }
    }

    console.log(currentMember);
  }, [data]);

  useEffect(() => {
    //check if this is the user's first time
    if (!isEmpty(currentMember) && clubID) {
      if (currentMember.isFirstTime && currentMember.isFirstTime === true) {
        dispatch(setClubMemberFirstTimeToFalse(clubID, currentMember.userID));
        setIsUserFirstTime(true);
      }
    }
  }, [clubID, currentMember]);

  //show edit buttons based on the user data logic
  //if filter returns null, show join button, dont show you button or add button
  //the members data can then be passed to clubsMembers as props
  //pass down current member data to all components as prop
  //same goes for clubsDetails
  //gallery and events get their data separately

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const toggleCreateAPostModal = () => {
    setShowCreateAPostModal(!showCreateAPostModal);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleYou = () => {
    navigation.navigate("ClubsYou");
  };

  const handleEditClub = () => {
    navigation.navigate("EditClub");
  };

  const handleJoin = () => {
    setShowAgreementPopUp(!showAgreementPopUp);
    const memberID = Crypto.randomUUID();
    const createdAt = new Date();

    const joinData = {
      name: user.name,
      phone: user.phone_number,
      email: user.email,
      intake: user.intake,
      department: user.department,
      memberID,
      userID: user.userId,
      role: "member",
      createdAt,
      profileImage: user.profileImage,
      bio: "",
    };

    const clubsData = {
      clubID: data.clubID,
      userID: user.userId,
      name: data.name,
      memberID,
      role: "member",
      createdAt,
      approval: "pending",
    };

    const notification = {
      preText: "New member request for",
      postText: "",
      sourceID: data.clubID,
      sourceName: data.name,
      sourceImage: data.image,
      sourceDestination: "ClubsPages",
      defaultText: "",
      read: false,
      userID: "",
      createdAt: new Date().toISOString(),
      notificationID: "",
    };

    const userIDs = [data.roles.president.userID];

    dispatch(joinClub(joinData, clubsData, data.clubID));
    // dispatch(createNotification(notification, userIDs));
    dispatch(sendPushNotification(notification, userIDs, campusID));
  };

  const UI = UIloading ? (
    <Loader />
  ) : (
    <ScrollView
      showsHorizontalScrollIndicator={false}
      stickyHeaderIndices={[2]}
    >
      {show && (
        <Animated.View
          entering={FadeInUp.duration(100)}
          exiting={FadeOutUp.duration(70)}
        >
          {data && data.image && (
            <View>
              <ImageBackground
                source={{ uri: data.image }}
                style={styles.imageHeaderContainer}
              ></ImageBackground>
            </View>
          )}
          <View
            style={{
              paddingHorizontal: pixelSizeHorizontal(16),
              flexDirection: "column",
              marginTop: pixelSizeVertical(10),
            }}
          >
            <Text style={styles.header}>{data.name}</Text>
            <Text
              style={{
                marginTop: pixelSizeVertical(4),
                fontSize: fontPixel(14),
                fontWeight: "400",
                color: "#C6CDE2",
              }}
            >
              {numberOfMembers}
            </Text>
            {!isEmpty(currentMember) ? (
              <PrimaryButton
                conditionToDisable={true}
                text="joined"
                textStyle={{
                  color: "#DFE5F8",
                }}
                buttonStyle={{
                  marginBottom: pixelSizeVertical(4),
                  backgroundColor: "#232F52",
                  opacity: 1,
                }}
              />
            ) : null}
          </View>
        </Animated.View>
      )}

      <View
        style={{
          paddingRight: pixelSizeHorizontal(16),
          paddingLeft: pixelSizeHorizontal(16),
        }}
      >
        {isEmpty(currentMember) && !hasRequested ? (
          <PrimaryButton
            onPress={() => setShowAgreementPopUp(!showAgreementPopUp)}
            text="join club"
            loading={loading}
            buttonStyle={{ marginBottom: pixelSizeVertical(4) }}
          />
        ) : null}
      </View>
      <ScrollView
        horizontal={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        style={{
          flexDirection: "row",
          paddingHorizontal: pixelSizeHorizontal(16),
          flexWrap: "wrap",
          backgroundColor: "#0C111F",
        }}
      >
        {tabs.map((tab) => {
          return (
            <Pressable
              key={tab}
              style={{
                paddingVertical: pixelSizeVertical(8),
                paddingHorizontal: pixelSizeHorizontal(12),
                backgroundColor: tab === "posts" ? "#6072A5" : "#232F52",
                marginHorizontal: pixelSizeHorizontal(4),
                borderRadius: 5,
                marginTop: pixelSizeVertical(16),
                marginBottom: pixelSizeVertical(16),
                opacity: tab === "extra" ? 0 : 1,
              }}
              onPress={() => tabNavigation(tab)}
            >
              <Text
                style={{
                  fontSize: fontPixel(14),
                  fontWeight: "500",
                  textAlign: "center",
                  color: "#DFE5F8",
                }}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Pressable
        style={{
          flexDirection: "row",
          paddingVertical: pixelSizeVertical(12),
          borderStyle: "solid",
          borderWidth: 1,
          borderTopColor: "#232F52",
          borderBottomColor: "#232F52",
          marginTop: pixelSizeVertical(24),
          paddingHorizontal: pixelSizeHorizontal(16),
        }}
        onPress={toggleCreateAPostModal}
      >
        <FastImage
          style={{
            width: widthPixel(40),
            height: heightPixel(40),
            marginTop: "auto",
            marginBottom: "auto",
            borderRadius: 50,
          }}
          resizeMode="cover"
          source={{ uri: currentMember.profileImage }}
          progressiveRenderingEnabled={true}
          cache={FastImage.cacheControl.immutable}
          priority={FastImage.priority.normal}
        />
        <Text
          style={{
            fontSize: fontPixel(14),
            fontWeight: "400",
            color: "#C6CDE2",
            marginLeft: pixelSizeHorizontal(12),
          }}
        >
          Write something...
        </Text>
      </Pressable>

      <FlatList
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        data={posts}
        renderItem={({ item }) => (
          <PostsAdapter item={item} context={context} />
        )}
      />
      <EmptyView />
    </ScrollView>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
    >
      <IosHeight />
      <View style={styles.headerContainerShowMiniHeader}>
        <Pressable
          onPress={handleNavigateBack}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Text style={styles.backButton}>back</Text>
        </Pressable>
        {isEmpty(currentMember) && !show && !UIloading ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              {data && data.name}
            </Text>
          </Animated.View>
        ) : (
          <Text style={styles.headerMiniInvisible}>title</Text>
        )}
        {!isEmpty(currentMember) && !UIloading && (
          <Pressable onPress={handleYou} style={styles.youButton}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={styles.youText}>you</Text>
              {isUserFirstTime && <RedDot />}
            </View>
          </Pressable>
        )}
        {!isEmpty(currentMember) &&
          currentMember.role === "president" &&
          !UIloading && (
            //if members requests > 0 show red dot
            <Pressable
              onPress={handleEditClub}
              style={
                canBeActivated
                  ? styles.youButtonNoAutoWarning
                  : styles.youButtonNoAuto
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={
                    canBeActivated
                      ? styles.youTextExtraMarginWarning
                      : styles.youTextExtraMargin
                  }
                >
                  club
                </Text>
                {(membersRequests.length > 0 || isClubFirstTime) && <RedDot />}
              </View>
            </Pressable>
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
      {UI}

      <Modal
        isVisible={showCreateAPostModal}
        onBackdropPress={toggleCreateAPostModal} // Android back press
        onSwipeComplete={toggleCreateAPostModal} // Swipe to discard
        animationIn="slideInUp" // Has others, we want slide in from the left
        animationOut="slideOutDown" // When discarding the drawer
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.createAPostMenuStyle} // Needs to contain the width, 75% of screen width in our case
      >
        <CreateAPostModal callParentScreenFunction={toggleCreateAPostModal} />
      </Modal>

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
        isVisible={showAgreementPopUp}
        onBackdropPress={() => setShowAgreementPopUp(!showAgreementPopUp)} // Android back press
        animationIn="bounceIn" // Has others, we want slide in from the left
        animationOut="bounceOut" // When discarding the drawer
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.withdrawPopupStyle} // Needs to contain the width, 75% of screen width in our case
      >
        <View style={styles.withdrawMenu}>
          <Text
            style={{
              fontSize: fontPixel(20),
              fontWeight: "400",
              color: "#DFE5F8",
              marginBottom: pixelSizeVertical(12),
              textAlign: "center",
            }}
          >
            By tapping confirm, you agree that your details can be shared to the
            club upon joining.
          </Text>
          <PrimaryButton
            loading={loading}
            onPress={handleJoin}
            text="confirm"
          />
          {!loading && (
            <Pressable
              onPress={() => setShowAgreementPopUp(!showAgreementPopUp)}
            >
              <Text style={styles.withdrawButton}>cancel</Text>
            </Pressable>
          )}
        </View>
      </Modal>
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
  },
  imageHeaderContainer: {
    height: pixelSizeVertical(180),
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
    fontSize: fontPixel(24),
    fontWeight: "600",
    color: "#DFE5F8",
  },
  navigationContainer: {
    marginTop: pixelSizeVertical(16),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  navigationLinkActive: {
    color: "#DFE5F8",
    fontSize: fontPixel(16),
    fontWeight: "500",
    width: width / 4,
    textAlign: "center",
  },
  navigationLinkInactive: {
    color: "#DFE5F8",
    fontSize: fontPixel(16),
    fontWeight: "400",
    opacity: 0.5,
  },
  navigationBorderActive: {
    borderBottomColor: "#DFE5F8",
    borderBottomWidth: 1,
    width: "100%",
    marginTop: pixelSizeVertical(10),
  },
  navigationBorderInactive: {
    borderBottomColor: "#DFE5F8",
    borderBottomWidth: 1,
    width: "100%",
    opacity: 0.5,
    marginTop: pixelSizeVertical(-1),
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
  createAPostMenuStyle: {
    margin: 0,
    marginTop: pixelSizeVertical(150),
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
  youButtonNoAuto: {
    marginRight: pixelSizeHorizontal(18),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(1),
    paddingBottom: pixelSizeVertical(6),
    backgroundColor: "#232F52",
    borderRadius: 5,
  },
  youButtonNoAutoWarning: {
    marginRight: pixelSizeHorizontal(18),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(1),
    paddingBottom: pixelSizeVertical(6),
    backgroundColor: "#C4FFF9",
    borderRadius: 5,
  },
  youButton: {
    marginLeft: "auto",
    marginRight: pixelSizeHorizontal(12),
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(1),
    paddingBottom: pixelSizeVertical(6),
    backgroundColor: "#232F52",
    borderRadius: 5,
  },
  youText: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
  },
  youTextExtraMargin: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    marginTop: pixelSizeVertical(1.5),
    color: "#DFE5F8",
  },
  youTextExtraMarginWarning: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    marginTop: pixelSizeVertical(1.5),
    color: "#0C111F",
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
  withdrawButton: {
    fontSize: fontPixel(18),
    fontWeight: "400",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
  },
});
