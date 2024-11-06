import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector, useDispatch } from "react-redux";

import { handleUpdateClubDetails } from "../src/redux/actions/dataActions";
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
import LinksView from "../components/LinksView";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import IosHeight from "../components/IosHeight";
import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import SideMenu from "../components/SideMenu";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import Modal from "react-native-modal";

const { width } = Dimensions.get("window");

const ClubsDetails = React.memo(({ navigation }) => {
  const dispatch = useDispatch();

  const club = useSelector((state) => state.data.clubData.club);
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const campusID = useSelector((state) => state.data.campus.campusID);
  const data = useSelector((state) => state.data.clubData.club.details);
  const loading = useSelector((state) => state.data.loading);

  const [meetings, setMeetings] = useState("");
  const [fees, setFees] = useState("");
  const [more, setMore] = useState("");

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  useEffect(() => {
    //if scroll height is more than header height and the header is not shown, show
    if (scrollHeight > headerHeight && !showMiniHeader) setShowMiniHeader(true);
    else if (scrollHeight < headerHeight && showMiniHeader)
      setShowMiniHeader(false);
  }, [scrollHeight, showMiniHeader]);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    setDetails();
  }, [data]);

  const setDetails = () => {
    if (data) {
      setMeetings(data.schedule);
      setFees(data.fees);
      setMore(data.misc);
    }
  };

  const handleUpdateDetails = () => {
    const updateData = {
      schedule: meetings,
      fees,
      misc: more,
    };
    dispatch(handleUpdateClubDetails(club.clubID, updateData));
  };

  //show normal view if user is other than president
  //show edit view if user is presient

  const normalView = (
    <>
      {meetings && <Text style={styles.title}>Meetings</Text>}
      {meetings && <Text style={styles.content}>{meetings}</Text>}
      {fees && <Text style={styles.titleMarginTop}>Fees</Text>}
      {fees && <Text style={styles.content}>{fees}</Text>}
      {more && <Text style={styles.titleMarginTop}>More...</Text>}
      {more && <Text style={styles.content}>{more}</Text>}
      <LinksView content={`${meetings} ${fees} ${more}`} />
    </>
  );

  const editView = (
    <>
      <Text style={[styles.title, { paddingLeft: pixelSizeHorizontal(8) }]}>
        Meetings
      </Text>
      <CustomTextInput
        placeholder="Enter your club's meeting schedule. It would be good to add the day, time, venue, and frequency. Eg: Every Thurday, 5pm, at LR504."
        value={meetings}
        multiline={true}
        numberOfLines={4}
        editable={!loading}
        onChangeText={(meetings) => setMeetings(meetings)}
      />
      <Text
        style={[styles.titleMarginTop, { paddingLeft: pixelSizeHorizontal(8) }]}
      >
        Fees
      </Text>
      <CustomTextInput
        placeholder="Enter your club's fees. Please add the amount, and frequency. Eg: RM20 per month."
        value={fees}
        multiline={true}
        numberOfLines={4}
        editable={!loading}
        onChangeText={(fees) => setFees(fees)}
      />
      <Text
        style={[styles.titleMarginTop, { paddingLeft: pixelSizeHorizontal(8) }]}
      >
        More...
      </Text>
      <CustomTextInput
        placeholder="Enter more details about the Club should you wish to share. This is optional."
        value={more}
        multiline={true}
        numberOfLines={4}
        editable={!loading}
        onChangeText={(more) => setMore(more)}
      />
      {((data && meetings !== data.schedule) ||
        (data && fees !== data.fees) ||
        (data && more !== data.misc)) && (
        <>
          <PrimaryButton
            loading={loading}
            onPress={handleUpdateDetails}
            text="save"
          />
          <Pressable
            onPress={() => {
              setDetails();
            }}
          >
            <Text style={styles.tertiaryButton}>discard</Text>
          </Pressable>
        </>
      )}
    </>
  );

  return (
    <View style={styles.container} scrollEventThrottle={16}>
      <IosHeight />
      <View style={styles.headerContainerShowMiniHeader}>
        <Pressable
          onPress={handleNavigateBack}
          hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
        >
          <Text style={styles.backButton}>back</Text>
        </Pressable>
        {showMiniHeader ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              details
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
        onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
        style={{
          paddingHorizontal: pixelSizeHorizontal(16),
        }}
      >
        <View onLayout={onLayout}>
          <Header header="details" />
        </View>
        {!isEmpty(currentMember) && currentMember.role === "president"
          ? editView
          : normalView}
        <Toast config={toastConfig} />
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
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
  },
  title: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(4),
  },
  titleMarginTop: {
    marginTop: pixelSizeVertical(16),
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(4),
  },
  content: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
  },
  tertiaryButton: {
    color: "#A7AFC7",
    fontSize: fontPixel(22),
    textTransform: "lowercase",
    fontWeight: "400",
    textAlign: "center",
  },
  warningText: {
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
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
});

export default ClubsDetails;
