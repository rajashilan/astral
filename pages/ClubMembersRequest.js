import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  acceptNewMember,
  rejectNewMember,
  sendPushNotification,
} from "../src/redux/actions/dataActions";
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

export default function ClubMembersRequest({ navigation }) {
  const dispatch = useDispatch();
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const club = useSelector((state) => state.data.clubData.club);
  const loading = useSelector((state) => state.data.loading);
  const campusID = useSelector((state) => state.data.campus.campusID);
  const rejectLoading = useSelector((state) => state.UI.loading);
  const membersRequests = useSelector(
    (state) => state.data.clubData.club.membersRequests
  );

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [indexSelected, setIndexSelected] = useState(0);

  const onSelect = (indexSelected) => {
    setIndexSelected(indexSelected);
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const handleAcceptMember = (item, accepted) => {
    if (accepted) {
      dispatch(acceptNewMember(item, club.clubID));
      const notification = {
        preText: "Your request to join",
        postText: "has been approved",
        sourceID: club.clubID,
        sourceName: club.name,
        sourceImage: club.image,
        sourceDestination: "ClubsPages",
        defaultText: "",
        read: false,
        userID: "",
        createdAt: new Date().toISOString(),
        notificationID: "",
      };
      const userIDs = [item.userID];
      dispatch(sendPushNotification(notification, userIDs, campusID));
    } else {
      dispatch(rejectNewMember(item, club.clubID));
      const notification = {
        preText: "Your request to join",
        postText: "was denied. Please feel free to reapply.",
        sourceID: club.clubID,
        sourceName: club.name,
        sourceImage: club.image,
        sourceDestination: "ClubsPages",
        defaultText: "",
        read: false,
        userID: "",
        createdAt: new Date().toISOString(),
        notificationID: "",
      };
      const userIDs = [item];
      dispatch(sendPushNotification(notification, userIDs, campusID));
    }
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
          <View style={{ width: "100%", flexDirection: "column" }}>
            <Header header={"members' requests"} />
            <Text style={styles.disclaimer}>view and accept new members</Text>
            {membersRequests && membersRequests.length > 0 && (
              <>
                <Pagination
                  inactiveDotColor="#546593"
                  dotColor="#C4FFF9"
                  activeDotIndex={indexSelected}
                  containerStyle={{
                    paddingTop: 0,
                    paddingRight: pixelSizeHorizontal(16),
                    paddingLeft: pixelSizeHorizontal(16),
                    paddingBottom: 0,
                    marginBottom: pixelSizeVertical(12),
                    marginTop: pixelSizeVertical(24),
                  }}
                  dotsLength={membersRequests.length}
                  inactiveDotScale={1}
                />
                <Carousel
                  layout="default"
                  data={membersRequests}
                  disableIntervalMomentum
                  useExperimentalSnap
                  onSnapToItem={(index) => onSelect(index)}
                  sliderWidth={width - 32}
                  itemWidth={width - 32}
                  renderItem={({ item, index }) => (
                    <>
                      <FastImage
                        key={index}
                        style={
                          membersRequests.length > 1
                            ? styles.image
                            : [
                                styles.image,
                                { marginTop: pixelSizeVertical(24) },
                              ]
                        }
                        resizeMode="contain"
                        source={{ uri: item.profileImage }}
                        progressiveRenderingEnabled={true}
                        cache={FastImage.cacheControl.immutable}
                        priority={FastImage.priority.normal}
                      />
                      <Text style={styles.title}>
                        {item.name} - Intake {item.intake}, {item.department}
                      </Text>
                      {!isEmpty(currentMember) &&
                        currentMember.role === "president" && (
                          <>
                            <PrimaryButton
                              loading={loading}
                              conditionToDisable={loading || rejectLoading}
                              onPress={() => handleAcceptMember(item, true)}
                              text="accept"
                            />
                            {!loading && (
                              <Pressable
                                disabled={rejectLoading}
                                onPress={() =>
                                  handleAcceptMember(item.userID, false)
                                }
                              >
                                <Text style={styles.withdrawButton}>
                                  {rejectLoading ? "rejecting..." : "reject"}
                                </Text>
                              </Pressable>
                            )}
                          </>
                        )}
                    </>
                  )}
                />
              </>
            )}
            {membersRequests && membersRequests.length === 0 && (
              <Text
                style={{
                  fontSize: fontPixel(18),
                  fontWeight: "400",
                  color: "#DFE5F8",
                  textAlign: "center",
                  marginTop: pixelSizeVertical(48),
                }}
              >
                no members requests at the moment.
              </Text>
            )}
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
  disclaimer: {
    marginTop: pixelSizeVertical(-18),
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#C6CDE2",
  },
  title: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(4),
  },
  withdrawButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
  },
});
