import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

import Header from "../components/Header";
import IosHeight from "../components/IosHeight";

import club1 from "../assets/club1.png";
import club2 from "../assets/club2.png";
import club3 from "../assets/club3.png";
import club4 from "../assets/club4.png";
import club5 from "../assets/club5.png";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";

import { useDispatch, useSelector } from "react-redux";
import { firebase } from "../src/firebase/config";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const db = firebase.firestore();

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

export default function Clubs({ navigation }) {
  const user = useSelector((state) => state.user.credentials);
  const state = useSelector((state) => state.data);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [tab, setTab] = useState("all clubs");

  const [all, setAll] = useState([]);

  const [yours, setYours] = useState([]);

  useEffect(() => {
    console.log(state.campus.campusID);
    db.doc(`/clubsOverview/${state.campus.campusID}`)
      .get()
      .then((doc) => {
        if (doc.data()) setAll(doc.data().clubs);
      })
      .catch((error) => console.error(error));
  }, [state.campus.campusID]);

  useEffect(() => {
    let temp = [];
    if (all.length > 0 && user.clubs.length > 0) {
      user.clubs.map((club) => {
        let index = all.findIndex((all) => all.clubID === club.clubID);
        if (index !== -1) {
          temp.push({
            ...all[index],
            role: club.role,
          });
        }
      });
    }
    setYours([...temp]);
    console.log(all);
  }, [all]);

  useEffect(() => {
    console.log(yours);
  }, [yours]);

  const handlePageItemPress = () => {
    navigation.navigate("ClubsPages");
  };

  const handlePageItemResubmit = () => {};

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const onLayout = (event) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  useEffect(() => {
    //if scroll height is more than header height and the header is not shown, show
    if (scrollHeight > headerHeight && !showMiniHeader) setShowMiniHeader(true);
    else if (scrollHeight < headerHeight && showMiniHeader)
      setShowMiniHeader(false);
  }, [scrollHeight, showMiniHeader]);

  return (
    <>
      <View style={styles.container}>
        <IosHeight />
        <View
          style={
            showMiniHeader
              ? styles.headerContainerShowMiniHeader
              : styles.headerContainerHideMiniHeader
          }
        >
          {showMiniHeader ? (
            <Animated.View
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
            >
              <Text style={styles.headerMini} numberOfLines={1}>
                {tab}
              </Text>
            </Animated.View>
          ) : (
            <Text style={styles.headerMiniInvisible}>title</Text>
          )}
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
          scrollEventThrottle={16}
          onScroll={(event) =>
            setScrollHeight(event.nativeEvent.contentOffset.y)
          }
          showsVerticalScrollIndicator={false}
        >
          <View
            onLayout={onLayout}
            style={{ display: "flex", flexDirection: "row" }}
          >
            <Pressable onPress={() => setTab("all clubs")}>
              <Text
                style={
                  tab === "all clubs" ? styles.tabActive : styles.tabInactive
                }
              >
                all clubs
              </Text>
            </Pressable>
            <Pressable onPress={() => setTab("yours")}>
              <Text
                style={tab === "yours" ? styles.tabActive : styles.tabInactive}
              >
                yours
              </Text>
            </Pressable>
          </View>

          <FlatList
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={tab === "all clubs" ? all : yours}
            renderItem={({ item }) => (
              <View style={{ marginBottom: pixelSizeHorizontal(30) }}>
                {item.approval === "pending" ? (
                  item.createdBy === user.userId && (
                    <>
                      <View style={styles.borderPending} />
                      <Text style={styles.pageItemsPending}>{item.name}</Text>
                      <Text style={styles.pageItemSubtitlePending}>
                        {item.approval}
                      </Text>
                    </>
                  )
                ) : item.approval === "rejected" ? (
                  item.createdBy === user.userId && (
                    <Pressable onPress={handlePageItemResubmit}>
                      <View style={styles.borderRejected} />
                      <Text style={styles.pageItemsPending}>{item.name}</Text>
                      <Text style={styles.pageItemSubtitleSuspendedSmaller}>
                        {item.approval}
                      </Text>
                      <Text style={styles.pageItemSubtitleRejected}>
                        {item.rejectionReason}
                      </Text>
                    </Pressable>
                  )
                ) : item.status === "inactive" ? (
                  <Pressable onPress={handlePageItemPress}>
                    {item.image ? (
                      <Image
                        style={styles.imageHalfOpacity}
                        source={item.image}
                        contentFit="cover"
                        transition={1000}
                      />
                    ) : (
                      <View style={styles.borderInactive} />
                    )}
                    <Text style={styles.pageItemsInactive}>{item.name}</Text>
                    <Text style={styles.pageItemSubtitleInactive}>
                      {item.status}
                    </Text>
                  </Pressable>
                ) : item.status === "suspended" ? (
                  <>
                    {item.image ? (
                      <Image
                        style={styles.imageHalfOpacity}
                        source={item.image}
                        contentFit="cover"
                        transition={1000}
                      />
                    ) : (
                      <View style={styles.borderRejected} />
                    )}
                    <Text style={styles.pageItemsSuspended}>{item.name}</Text>
                    <Text style={styles.pageItemSubtitleSuspendedSmaller}>
                      {item.status}
                    </Text>
                  </>
                ) : item.status === "deactivated" ? (
                  <Pressable onPress={handlePageItemPress}>
                    {item.image ? (
                      <Image
                        style={styles.imageHalfOpacity}
                        source={item.image}
                        contentFit="cover"
                        transition={1000}
                      />
                    ) : (
                      <View style={styles.borderInactive} />
                    )}
                    <Text style={styles.pageItemsInactive}>{item.name}</Text>
                    <Text style={styles.pageItemSubtitleInactive}>
                      {item.status}
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={handlePageItemPress}>
                    {item.image ? (
                      <Image
                        style={styles.image}
                        source={item.image}
                        contentFit="cover"
                        transition={1000}
                      />
                    ) : (
                      <View style={styles.borderNormal} />
                    )}
                    <Text style={styles.pageItems}>{item.name}</Text>
                  </Pressable>
                )}
              </View>
            )}
          />
          {tab === "yours" && yours.length === 0 ? (
            <View style={styles.joinClubContainer}>
              <View style={styles.joinClubInnerContainer}>
                <Pressable onPress={() => setTab("all clubs")}>
                  <Text style={styles.joinClubButton}>Find your club,</Text>
                </Pressable>
                <Text style={styles.joinClubText}>
                  make friends, and share your passion!
                </Text>
              </View>

              <View style={styles.joinClubInnerContainer}>
                <Text style={styles.joinClubText}>
                  Can't find the perfect club?
                </Text>
                <Pressable onPress={() => navigation.navigate("CreateAClub")}>
                  <Text style={styles.joinClubButton}>Create your own!</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => navigation.navigate("CreateAClub")}
              style={{ alignItems: "center" }}
            >
              <Text style={styles.joinClubSmallButton}>
                Create your own club
              </Text>
            </Pressable>
          )}
          <View style={styles.emptyView}></View>
        </ScrollView>
      </View>
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
    </>
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
    fontSize: fontPixel(42),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  image: {
    width: "100%",
    height: heightPixel(150),
    marginBottom: pixelSizeVertical(10),
    borderRadius: 5,
  },
  borderPending: {
    width: "100%",
    height: heightPixel(150),
    marginBottom: pixelSizeVertical(10),
    borderRadius: 5,
    borderWidth: 3,
    opacity: 0.5,
    borderColor: "#C6CDE2",
  },
  borderNormal: {
    width: "100%",
    height: heightPixel(150),
    marginBottom: pixelSizeVertical(10),
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#DFE5F8",
  },
  borderInactive: {
    width: "100%",
    height: heightPixel(150),
    marginBottom: pixelSizeVertical(10),
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#232F52",
  },
  borderRejected: {
    width: "100%",
    height: heightPixel(150),
    marginBottom: pixelSizeVertical(10),
    borderRadius: 5,
    borderWidth: 3,
    borderColor: "#9B222C",
  },
  imageHalfOpacity: {
    width: "100%",
    height: heightPixel(150),
    marginBottom: pixelSizeVertical(10),
    borderRadius: 5,
    opacity: 0.5,
  },
  pageItems: {
    fontSize: fontPixel(28),
    fontWeight: "500",
    color: "#C4FFF9",
    lineHeight: 36,
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
  },
  pageItemsPending: {
    fontSize: fontPixel(28),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 36,
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
  },
  pageItemsInactive: {
    fontSize: fontPixel(28),
    fontWeight: "400",
    color: "#232F52",
    lineHeight: 36,
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
  },
  pageItemsSuspended: {
    fontSize: fontPixel(28),
    fontWeight: "400",
    color: "#A3222D",
    marginTop: pixelSizeVertical(4),
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
  },
  pageItemSubtitleSuspended: {
    fontSize: fontPixel(18),
    fontWeight: "400",
    color: "#A3222D",
    marginTop: pixelSizeVertical(4),
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
  },
  pageItemSubtitleSuspendedSmaller: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#A3222D",
    marginTop: pixelSizeVertical(4),
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
  },
  pageItemSubtitlePending: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 36,
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
  },
  pageItemSubtitleRejected: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
    marginTop: pixelSizeVertical(2),
    marginBottom: pixelSizeVertical(-3),
  },
  pageItemSubtitleInactive: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#232F52",
    lineHeight: 36,
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
    marginBottom: pixelSizeVertical(-3),
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(60),
    backgroundColor: "#0C111F",
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
  },
  headerContainerHideMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  tabActive: {
    fontSize: fontPixel(34),
    fontWeight: "500",
    color: "#C4FFF9",
    marginBottom: pixelSizeVertical(18),
    marginRight: pixelSizeHorizontal(32),
  },
  tabInactive: {
    fontSize: fontPixel(34),
    fontWeight: "500",
    color: "#C4FFF9",
    marginBottom: pixelSizeVertical(18),
    opacity: 0.5,
    marginRight: pixelSizeHorizontal(32),
  },
  joinClubContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: pixelSizeVertical(24),
  },
  joinClubInnerContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: pixelSizeVertical(24),
  },
  joinClubButton: {
    fontSize: fontPixel(36),
    fontWeight: "500",
    color: "#07BEB8",
    textDecorationLine: "underline",
  },
  joinClubSmallButton: {
    fontSize: fontPixel(20),
    fontWeight: "500",
    color: "#07BEB8",
    textDecorationLine: "underline",
    marginTop: pixelSizeVertical(42),
  },
  joinClubText: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
  },
});
