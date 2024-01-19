import firestore from "@react-native-firebase/firestore";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Pressable,
  Dimensions,
  TextInput,
  ScrollView,
} from "react-native";
import { Wave } from "react-native-animated-spinkit";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import Hamburger_Icon from "../assets/Hamburger_Icon";
import IosHeight from "../components/IosHeight";
// import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import { getAuthenticatedUser } from "../src/redux/actions/userActions";
import {
  fontPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import EmptyView from "../components/EmptyView";

const { width } = Dimensions.get("window");
const db = firestore();

export default React.memo(function Clubs({ navigation }) {
  const user = useSelector((state) => state.user.credentials);
  const state = useSelector((state) => state.data);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState("all clubs");
  const [all, setAll] = useState([]);
  const [yours, setYours] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    //get clubs from clubs overview
    setLoading(true);
    db.collection("clubsOverview")
      .doc(state.campus.campusID)
      .get()
      .then((doc) => {
        if (doc.data()) setAll(doc.data().clubs);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [state.campus.campusID]);

  const onRefresh = React.useCallback(() => {
    //get clubs from clubs overview
    setRefreshing(true);
    setSearch("");
    setLoading(true);
    dispatch(getAuthenticatedUser(user.email));
    db.collection("clubsOverview")
      .doc(state.campus.campusID)
      .get()
      .then((doc) => {
        if (doc.data()) setAll(doc.data().clubs);
        setRefreshing(false);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setRefreshing(false);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const temp = [];
    if (all && user && all.length > 0 && user.clubs && user.clubs.length > 0) {
      user.clubs.forEach((club) => {
        const foundClub = all.find((allClub) => allClub.clubID === club.clubID);
        if (foundClub) {
          temp.push({
            ...foundClub,
            role: club.role,
          });
        }
      });
    }
    setYours(temp);
  }, [all, user.clubs]);

  useEffect(() => {
    return () => {
      setSearch("");
    };
  }, []);

  const handlePageItemPress = (clubID) => {
    navigation.navigate("ClubsPages", { clubID });
  };

  const handlePageItemResubmit = (clubID) => {
    navigation.navigate("ClubResubmission", { clubID });
  };

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

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

  const UI = loading ? (
    <View style={{ marginTop: pixelSizeVertical(60) }}>
      <Wave
        size={240}
        color="#495986"
        style={{ alignSelf: "center", marginBottom: pixelSizeVertical(260) }}
      />
    </View>
  ) : (
    <ScrollView
      stickyHeaderIndices={[1]}
      scrollEventThrottle={16}
      onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View
        onLayout={onLayout}
        style={{ display: "flex", flexDirection: "row" }}
      >
        <Pressable onPress={() => setTab("all clubs")}>
          <Text
            style={tab === "all clubs" ? styles.tabActive : styles.tabInactive}
          >
            all clubs
          </Text>
        </Pressable>
        <Pressable onPress={() => setTab("yours")}>
          <Text style={tab === "yours" ? styles.tabActive : styles.tabInactive}>
            yours
          </Text>
        </Pressable>
      </View>
      {tab !== "yours" || yours.length > 2 ? (
        <View
          style={{
            backgroundColor: "#0C111F",
          }}
        >
          <TextInput
            style={styles.textInput}
            placeholder={
              tab === "all clubs" ? "Search for clubs" : "Search for your clubs"
            }
            placeholderTextColor="#DBDBDB"
            value={search}
            onChangeText={(newSearch) => setSearch(newSearch)}
          />
        </View>
      ) : null}
      <FlatList
        keyExtractor={(item, index) => index.toString()}
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        data={
          tab === "all clubs"
            ? all.filter((club) =>
                club.name.toLowerCase().includes(search.toLowerCase())
              )
            : yours.filter((club) =>
                club.name.toLowerCase().includes(search.toLowerCase())
              )
        }
        renderItem={({ item }) => (
          <View style={{ marginBottom: pixelSizeHorizontal(30) }}>
            {item.approval === "pending" ? (
              item.createdBy === user.userId && (
                <>
                  <FastImage
                    style={styles.imageHalfOpacity}
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    transition={1000}
                    progressiveRenderingEnabled={true}
                    cache={FastImage.cacheControl.immutable}
                    priority={FastImage.priority.normal}
                  />
                  <Text style={styles.pageItemsPending}>{item.name}</Text>
                  <Text style={styles.pageItemSubtitlePending}>
                    {item.approvalText}
                  </Text>
                </>
              )
            ) : item.approval === "rejected" ? (
              item.createdBy === user.userId && (
                <Pressable onPress={() => handlePageItemResubmit(item.clubID)}>
                  <FastImage
                    style={styles.imageHalfOpacity}
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    transition={1000}
                    progressiveRenderingEnabled={true}
                    cache={FastImage.cacheControl.immutable}
                    priority={FastImage.priority.normal}
                  />
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
              item.createdBy === user.userId && (
                <Pressable onPress={() => handlePageItemPress(item.clubID)}>
                  <FastImage
                    style={styles.imageHalfOpacity}
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    transition={1000}
                    progressiveRenderingEnabled={true}
                    cache={FastImage.cacheControl.immutable}
                    priority={FastImage.priority.normal}
                  />
                  <Text style={styles.pageItemsInactive}>{item.name}</Text>
                  <Text style={styles.pageItemSubtitleInactive}>
                    {item.status}
                  </Text>
                </Pressable>
              )
            ) : item.status === "suspended" ? (
              item.createdBy === user.userId && (
                <>
                  <FastImage
                    style={styles.imageHalfOpacity}
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    transition={1000}
                    progressiveRenderingEnabled={true}
                    cache={FastImage.cacheControl.immutable}
                    priority={FastImage.priority.normal}
                  />
                  <Text style={styles.pageItemsSuspended}>{item.name}</Text>
                  <Text style={styles.pageItemSubtitleSuspendedSmaller}>
                    {item.status}
                  </Text>
                </>
              )
            ) : item.status === "deactivated" ? (
              item.createdBy === user.userId && (
                <Pressable onPress={() => handlePageItemPress(item.clubID)}>
                  <FastImage
                    style={styles.imageHalfOpacity}
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    transition={1000}
                    progressiveRenderingEnabled={true}
                    cache={FastImage.cacheControl.immutable}
                    priority={FastImage.priority.normal}
                  />
                  <Text style={styles.pageItemsInactive}>{item.name}</Text>
                  <Text style={styles.pageItemSubtitleInactive}>
                    {item.status}
                  </Text>
                </Pressable>
              )
            ) : (
              <Pressable onPress={() => handlePageItemPress(item.clubID)}>
                <FastImage
                  style={styles.image}
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  transition={1000}
                  progressiveRenderingEnabled={true}
                  cache={FastImage.cacheControl.immutable}
                  priority={FastImage.priority.normal}
                />
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
          <Text style={styles.joinClubSmallButton}>Create your own club</Text>
        </Pressable>
      )}
      <EmptyView />
    </ScrollView>
  );

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
          {/* <Pressable
            onPress={toggleSideMenu}
            hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
          >
            <FastImage
              style={styles.hamburgerIcon}
              source={hamburgerIcon}
              resizeMode="contain"
            />
          </Pressable> */}
          <Pressable
            onPress={toggleSideMenu}
            hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
          >
            <Hamburger_Icon />
          </Pressable>
        </View>

        {UI}
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
          currentPage="clubs"
          navigation={navigation}
        />
      </Modal>

      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </>
  );
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
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
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
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
  textInput: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    marginTop: pixelSizeVertical(10),
    marginBottom: pixelSizeVertical(18),
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    width: "100%",
    borderRadius: 5,
  },
});
