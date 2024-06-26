import firestore from "@react-native-firebase/firestore";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Dimensions,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut, FadeInDown } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  fontPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import EmptyView from "../components/EmptyView";
import { retrieveData, saveData } from "../utils/cache";
import CustomTextInput from "../components/CustomTextInput";
import Loader from "../components/Loader";
const db = firestore();

const { width } = Dimensions.get("window");

export default function GeneralForms({ navigation }) {
  const campus = useSelector((state) => state.data.campus);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [search, setSearch] = useState("");

  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    if (!campus.campusID) {
      return;
    }

    setLoading(true);
    db.collection("generalFormsOverview")
      .doc(campus.campusID)
      .get()
      .then((doc) => {
        setLoading(false);
        const temp = doc.data().forms;
        setData([...temp]);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
        Toast.show({
          type: "error",
          text1: "something went wrong",
        });
      });
  }, [campus.campusID]);

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    db.collection("generalFormsOverview")
      .doc(campus.campusID)
      .get()
      .then((doc) => {
        setLoading(false);
        setRefreshing(false);
        const temp = doc.data().forms;
        setData([...temp]);
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        console.error(error);
        Toast.show({
          type: "error",
          text1: "something went wrong",
        });
      });
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

  const handleOnPress = (item) => {
    if (item.type === "easyFill")
      navigation.navigate("GeneralFormsPage", {
        id: item.generalFormID,
      });
    else WebBrowser.openBrowserAsync(item.link);
  };

  const UI = loading ? (
    <Loader />
  ) : (
    <Animated.ScrollView
      entering={FadeInDown.duration(300)}
      scrollEventThrottle={16}
      stickyHeaderIndices={[1]}
      onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {!isEmpty(data) && (
        <View onLayout={onLayout}>
          <Header header="general forms" />
        </View>
      )}
      {!isEmpty(data) && (
        <View
          style={{
            backgroundColor: "#0C111F",
          }}
        >
          <CustomTextInput
            placeholder="search for forms..."
            onChangeText={(newSearch) => setSearch(newSearch)}
            value={search}
            inputStyle={{ marginBottom: pixelSizeVertical(18) }}
          />
        </View>
      )}
      <FlatList
        style={styles.list}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        data={
          search === ""
            ? data
            : data.filter((form) =>
                form.title.toLowerCase().includes(search.toLowerCase())
              )
        }
        renderItem={({ item }) => (
          <>
            <Pressable onPress={() => handleOnPress(item)}>
              <Text style={styles.pageItems}>
                {item.title}{" "}
                {item.type === "easyFill" ? (
                  <Text
                    style={{
                      fontSize: fontPixel(16),
                      fontWeight: "400",
                      color: "#07BEB8",
                      marginTop: pixelSizeVertical(-10),
                      marginBottom: pixelSizeVertical(12),
                    }}
                  >
                    {" "}
                    easy fill
                  </Text>
                ) : null}
              </Text>
            </Pressable>
            <View style={styles.divider} />
          </>
        )}
      />
      <EmptyView />
    </Animated.ScrollView>
  );

  return (
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
        {showMiniHeader ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              general forms
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
          currentPage="general forms"
          navigation={navigation}
        />
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
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingBottom: pixelSizeVertical(16),
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
  pageItems: {
    fontSize: fontPixel(28),
    fontWeight: "500",
    color: "#C4FFF9",
    marginBottom: pixelSizeVertical(12),
  },
  divider: {
    borderBottomColor: "#283350",
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: pixelSizeVertical(12),
  },
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
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
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(30),
  },
});
