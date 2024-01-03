import firestore from "@react-native-firebase/firestore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
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
import { Wave } from "react-native-animated-spinkit";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import { setNotificationsRead } from "../src/redux/actions/dataActions";
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

export default function Notifications({ navigation }) {
  dayjs.extend(relativeTime);

  const dispatch = useDispatch();
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
        const temp = [];
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
      const notificationIDs = [];
      const temp = data.slice(-12);
      temp.forEach((notification) => {
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
            <Header header="notifications" />
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
                  <FastImage
                    style={styles.image}
                    resizeMode="cover"
                    source={{ uri: item.sourceImage }}
                    progressiveRenderingEnabled={true}
                    cache={FastImage.cacheControl.immutable}
                    priority={FastImage.priority.normal}
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
          <FastImage
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            resizeMode="contain"
          />
        </Pressable>
      </View>
      {UI}
      <View style={styles.emptyView}></View>
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
          currentPage="notifications"
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
