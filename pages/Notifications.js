import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  FlatList,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";

import IosHeight from "../components/IosHeight";

import Toast from "react-native-toast-message";
import { toastConfig } from "../utils/toast-config";

import { useDispatch, useSelector } from "react-redux";

import Header from "../components/Header";

import { Bounce } from "react-native-animated-spinkit";

const { width } = Dimensions.get("window");

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import firestore from "@react-native-firebase/firestore";
import { setNotificationsRead } from "../src/redux/actions/dataActions";
const db = firestore();

export default function Notifications({ navigation }) {
  dayjs.extend(relativeTime);

  const dispatch = useDispatch();
  const campusID = useSelector((state) => state.data.campus.campusID);
  const user = useSelector((state) => state.user.credentials);
  const [loading, setLoading] = useState(true);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);

  const fetchClubs = () => {
    if (!lastDoc) setLoading(true);

    let query = db
      .collection("notifications")
      .where("userID", "==", user.userId)
      .orderBy("createdAt", "desc")
      .limit(12);

    if (lastDoc) query = query.startAfter(lastDoc);

    query
      .get()
      .then((dbData) => {
        let temp = [];
        dbData.forEach((doc) => {
          temp.push({ ...doc.data() });
        });
        if (temp.length > 0) {
          setLastDoc(dbData.docs[dbData.docs.length - 1]);
          if (data.length > 0) {
            setData([...data, ...temp]);
          } else setData([...temp]);
        }
        setLoading(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Something went wrong",
        });
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchClubs();
    return () => {
      setLastDoc(null);
      setData([]);
    };
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      let notificationIDs = [];
      let temp = data.slice(-12);
      data.forEach((notification) => {
        notificationIDs.push(notification.notificationID);
      });
      dispatch(setNotificationsRead(notificationIDs));
    }
  }, [data]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setLastDoc(null);
    fetchClubs();
  }, []);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isCloseToBottom) {
      fetchClubs();
    }
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

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  let UI = loading ? (
    <View style={{ marginTop: pixelSizeVertical(60) }}>
      <Bounce size={240} color="#495986" style={{ alignSelf: "center" }} />
    </View>
  ) : (
    <ScrollView
      scrollEventThrottle={16}
      stickyHeaderIndices={[1]}
      onScroll={(event) => {
        setScrollHeight(event.nativeEvent.contentOffset.y);
        handleScroll(event);
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ width: "100%", flexDirection: "column" }}>
        <View style={styles.paddingContainer}>
          <View onLayout={onLayout}>
            <Header header={"notifications"} />
          </View>
        </View>
        {data.length > 0 ? (
          <FlatList
            style={{ marginBottom: pixelSizeVertical(32) }}
            keyExtractor={(item, index) => index.toString()}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            data={data}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  if (item.sourceDestination) {
                    if (item.sourceDestination === "ClubsPages") {
                      navigation.navigate("ClubsPages", {
                        clubID: item.sourceID,
                      });
                    } else if (item.sourceDestination === "Clubs") {
                      navigation.navigate("Clubs");
                    }
                  }
                }}
              >
                <View
                  style={
                    item.read
                      ? styles.notificationContainerRead
                      : styles.notificationContainerUnread
                  }
                >
                  <Image
                    style={styles.image}
                    contentFit="cover"
                    source={item.sourceImage}
                  />
                  {item.defaultText ? (
                    <Text
                      style={{
                        flexGrow: 1,
                        flexShrink: 1,
                        lineHeight: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontPixel(14),
                          fontWeight: "400",
                          color: "#DFE5F8",
                        }}
                      >
                        {item.defaultText}
                      </Text>
                      <Text
                        style={{
                          fontSize: fontPixel(12),
                          fontWeight: "400",
                          color: "#A7AFC7",
                        }}
                      >
                        {" "}
                        {dayjs(item.createdAt.split("T")[0]).fromNow()}
                      </Text>
                    </Text>
                  ) : (
                    <Text
                      style={{ lineHeight: 20, flexGrow: 1, flexShrink: 1 }}
                    >
                      {item.preText && (
                        <Text
                          style={{
                            fontSize: fontPixel(14),
                            fontWeight: "400",
                            color: "#DFE5F8",
                          }}
                        >
                          {item.preText}{" "}
                        </Text>
                      )}
                      <Text
                        style={{
                          fontSize: fontPixel(14),
                          fontWeight: "600",
                          color: "#07BEB8",
                        }}
                      >
                        {item.sourceName}
                      </Text>
                      {item.postText && (
                        <Text
                          style={{
                            fontSize: fontPixel(14),
                            fontWeight: "400",
                            color: "#DFE5F8",
                          }}
                        >
                          {" "}
                          {item.postText}
                        </Text>
                      )}
                      <Text
                        style={{
                          fontSize: fontPixel(12),
                          fontWeight: "400",
                          color: "#A7AFC7",
                        }}
                      >
                        {" "}
                        {dayjs(new Date(item.createdAt).toString()).fromNow()}
                      </Text>
                    </Text>
                  )}
                </View>
              </Pressable>
            )}
          />
        ) : (
          <Text
            style={{
              fontSize: fontPixel(16),
              fontWeight: "400",
              color: "#DFE5F8",
              paddingRight: pixelSizeHorizontal(16),
              paddingLeft: pixelSizeHorizontal(16),
            }}
          >
            no notifications yet
          </Text>
        )}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <IosHeight />
      <View style={styles.headerContainerShowMiniHeader}>
        {showMiniHeader ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              notifications
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
      {UI}

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
          currentPage={"notifications"}
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
  imageHeaderContainer: {
    height: pixelSizeVertical(120),
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
    fontSize: fontPixel(34),
    fontWeight: "500",
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
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
  },
  headerContainer: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(16),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
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
  headerMini: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#DFE5F8",
    maxWidth: width - 180,
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
  image: {
    width: widthPixel(60),
    height: heightPixel(60),
    marginTop: "auto",
    marginBottom: "auto",
    marginRight: pixelSizeHorizontal(10),
    borderRadius: 50,
  },
  role: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(4),
  },
  name: {
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#DFE5F8",
    marginBottom: pixelSizeVertical(10),
  },
  quote: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    color: "#C6CDE2",
    lineHeight: 22,
  },
  textInput: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    width: "100%",
    borderRadius: 5,
    marginTop: pixelSizeVertical(10),
  },
  loginButtonLoadingText: {
    fontSize: fontPixel(22),
    fontWeight: "400",
    color: "#DFE5F8",
    textAlign: "center",
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
  tertiaryButton: {
    color: "#A7AFC7",
    fontSize: fontPixel(22),
    textTransform: "lowercase",
    fontWeight: "400",
    textAlign: "center",
  },
  disclaimer: {
    marginTop: pixelSizeVertical(-18),
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#C6CDE2",
  },
  imagePicker: {
    backgroundColor: "#232F52",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
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
  error: {
    marginTop: pixelSizeVertical(8),
    marginBottom: pixelSizeVertical(8),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#a3222d",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
  },
  altButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#07BEB8",
    marginTop: pixelSizeVertical(8),
  },
  altButtonInactive: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#07BEB8",
    marginTop: pixelSizeVertical(8),
    opacity: 0.5,
  },
  notificationContainerUnread: {
    backgroundColor: "#232F52",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(12),
    paddingBottom: pixelSizeVertical(12),
    flexDirection: "row",
    flexGrow: 1,
  },
  notificationContainerRead: {
    backgroundColor: "#0E1834",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(12),
    paddingBottom: pixelSizeVertical(12),
    flexDirection: "row",
    flexGrow: 1,
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
  },
});
