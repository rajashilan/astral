import firestore from "@react-native-firebase/firestore";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut, FadeInDown } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
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
import CustomTextInput from "../components/CustomTextInput";
import Loader from "../components/Loader";
import PostsAdapter from "../components/Posts/PostsAdapter";
import { SET_POSTS } from "../src/redux/type";

const { width } = Dimensions.get("window");
const db = firestore();

const context = "feed";

export default React.memo(function Feed({ navigation }) {
  const user = useSelector((state) => state.user.credentials);
  const showClubOnboarding = useSelector(
    (state) => state.user.showClubOnboarding
  );
  const state = useSelector((state) => state.data);
  const campusID = useSelector((state) => state.data.campus.campusID);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState("for you");

  const [userClubIDs, setUserClubIDs] = useState(null);
  const [retrivedUserClubIDs, setRetrievedUserClubIDs] = useState(false);

  const [tempPosts, setTempPosts] = useState([]);
  const [lostFocus, setLostFocus] = useState(false);

  const posts = useSelector((state) => state.data.posts);

  useEffect(() => {
    if (user) {
      let temp = [];
      user.clubs.forEach((club) => {
        temp.push(club.clubID);
      });
      setUserClubIDs([...temp]);
      setRetrievedUserClubIDs(true);
    }
  }, [user]);

  // Helper function to fetch posts
  const fetchPosts = async (tab, userClubIDs) => {
    try {
      if (tab === "for you") {
        const publicQuery = db
          .collection("posts")
          .where("campusID", "==", campusID)
          .where("visibility", "==", "public")
          .orderBy("createdAt", "desc");

        // If userClubIDs is empty, don't query for private posts
        let privatePosts = [];
        if (userClubIDs.length > 0) {
          const privateQuery = db
            .collection("posts")
            .where("campusID", "==", campusID)
            .where("visibility", "==", "private")
            .where("clubID", "in", userClubIDs)
            .orderBy("createdAt", "desc");

          privatePosts = await privateQuery.get();
        } else {
          privatePosts = { docs: [] };
        }

        const publicPosts = await publicQuery.get();

        // Combine public and private posts
        const allPosts = [...publicPosts.docs, ...privatePosts.docs].sort(
          (a, b) => {
            const dateA = new Date(a.data().createdAt); // Parse the string into a Date
            const dateB = new Date(b.data().createdAt); // Parse the string into a Date
            return dateB - dateA; // Compare timestamps (newer posts first)
          }
        );

        return allPosts;
      }
      if (tab === "following") {
        if (userClubIDs.length > 0) {
          query = db
            .collection("posts")
            .where("campusID", "==", campusID)
            .where("clubID", "in", userClubIDs)
            .orderBy("createdAt", "desc");

          const posts = await query.get();
          return posts.docs;
        } else {
          return [];
        }
      } else if (tab === "events") {
        const publicQuery = db
          .collection("posts")
          .where("campusID", "==", campusID)
          .where("type", "==", "event")
          .where("visibility", "==", "public")
          .orderBy("createdAt", "desc");

        // Declare a variable to hold private posts
        let privatePosts = [];

        // Only query for private posts if userClubIDs is not empty
        if (userClubIDs.length > 0) {
          const privateQuery = db
            .collection("posts")
            .where("campusID", "==", campusID)
            .where("type", "==", "event")
            .where("visibility", "==", "private")
            .where("clubID", "in", userClubIDs)
            .orderBy("createdAt", "desc");

          privatePosts = await privateQuery.get();
        } else {
          privatePosts = { docs: [] };
        }

        // Fetch public posts
        const publicPosts = await publicQuery.get();

        // Combine public and private posts
        const allPosts = [...publicPosts.docs, ...privatePosts.docs].sort(
          (a, b) => {
            const dateA = new Date(a.data().createdAt); // Parse the string into a Date
            const dateB = new Date(b.data().createdAt); // Parse the string into a Date
            return dateB - dateA; // Compare timestamps (newer posts first)
          }
        );

        return allPosts;
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
      return [];
    }
  };

  useEffect(() => {
    dispatch({ type: SET_POSTS, payload: [] });
    setLoading(true);
    (async () => {
      if (retrivedUserClubIDs) {
        const fetchedPosts = await fetchPosts(tab, userClubIDs);
        let temp = [];
        fetchedPosts.forEach((doc) => {
          temp.push(doc.data());
        });
        dispatch({ type: SET_POSTS, payload: temp });
        setTempPosts(temp);
        setLoading(false);
      }
    })();

    return () => {
      setTempPosts([]);
    };
  }, [tab, retrivedUserClubIDs]);

  useFocusEffect(
    React.useCallback(() => {
      dispatch({ type: SET_POSTS, payload: tempPosts });

      return () => {};
    }, [dispatch, tempPosts])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    setLoading(true);
    if (retrivedUserClubIDs) {
      const fetchedPosts = await fetchPosts(tab, userClubIDs);
      let temp = [];
      fetchedPosts.forEach((doc) => {
        temp.push(doc.data());
      });
      dispatch({ type: SET_POSTS, payload: temp });
      setTempPosts(temp);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePageItemPress = (clubID) => {
    navigation.navigate("ClubsPages", { clubID });
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
    <Loader />
  ) : (
    <Animated.ScrollView
      entering={FadeInDown.duration(300)}
      scrollEventThrottle={16}
      onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <FlatList
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        data={posts}
        renderItem={({ item }) => (
          <PostsAdapter item={item} context={context} />
        )}
      />
      <EmptyView />
      <EmptyView />
    </Animated.ScrollView>
  );

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
        style={styles.container}
      >
        <IosHeight />
        <View
          style={
            showMiniHeader
              ? styles.headerContainerShowMiniHeader
              : styles.headerContainerHideMiniHeader
          }
        >
          <Text style={styles.headerMiniInvisible}>title</Text>
          <Pressable
            onPress={toggleSideMenu}
            hitSlop={{ top: 20, bottom: 40, left: 20, right: 20 }}
          >
            <Hamburger_Icon />
          </Pressable>
        </View>
        <View
          onLayout={onLayout}
          style={{
            display: "flex",
            flexDirection: "row",
            paddingRight: pixelSizeHorizontal(16),
            paddingLeft: pixelSizeHorizontal(16),
          }}
        >
          <>
            <Pressable onPress={() => setTab("for you")}>
              <Text
                style={
                  tab === "for you" ? styles.tabActive : styles.tabInactive
                }
              >
                for you
              </Text>
            </Pressable>
            <Pressable onPress={() => setTab("following")}>
              <Text
                style={
                  tab === "following" ? styles.tabActive : styles.tabInactive
                }
              >
                following
              </Text>
            </Pressable>

            <Pressable onPress={() => setTab("events")}>
              <Text
                style={tab === "events" ? styles.tabActive : styles.tabInactive}
              >
                events
              </Text>
            </Pressable>
          </>
        </View>
        {UI}
      </KeyboardAvoidingView>
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
          currentPage="home"
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
    color: "#ed3444",
    marginTop: pixelSizeVertical(4),
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
  },
  pageItemSubtitleSuspended: {
    fontSize: fontPixel(18),
    fontWeight: "400",
    color: "#ed3444",
    marginTop: pixelSizeVertical(4),
    marginLeft: pixelSizeHorizontal(2),
    marginRight: pixelSizeHorizontal(2),
  },
  pageItemSubtitleSuspendedSmaller: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#ed3444",
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
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  headerContainerHideMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  tabActive: {
    fontSize: fontPixel(26),
    fontWeight: "500",
    color: "#C4FFF9",
    marginBottom: pixelSizeVertical(18),
    marginRight: pixelSizeHorizontal(18),
  },
  tabInactive: {
    fontSize: fontPixel(26),
    fontWeight: "500",
    color: "#C4FFF9",
    marginBottom: pixelSizeVertical(18),
    opacity: 0.5,
    marginRight: pixelSizeHorizontal(18),
  },
  joinClubContainer: {
    display: "flex",
    flexDirection: "column",
    marginBottom: pixelSizeVertical(24),
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
    marginBottom: pixelSizeVertical(22),
  },
  joinClubText: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
  },
});
