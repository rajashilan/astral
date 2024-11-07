import auth from "@react-native-firebase/auth";
import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import Notification_Alert_Icon from "../assets/Notification_Alert_Icon";
import Notification_Icon from "../assets/Notification_Icon";
import IosHeight from "../components/IosHeight";
import {
  getAuthenticatedUser,
  setUserFirstTimeToFalse,
} from "../src/redux/actions/userActions";
import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";
import { toastConfig } from "../utils/toast-config";
import EmptyView from "../components/EmptyView";
import Loader from "../components/Loader";
import RedDot from "../assets/RedDot";
import { SHOW_CLUB_ONBOARDING } from "../src/redux/type";

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const loading = useSelector((state) => state.user.loading);
  const dataLoading = useSelector((state) => state.data.loading);
  const user = useSelector((state) => state.user.credentials);
  const campusLogo = useSelector((state) => state.data.campus.logo);
  const logoBackground = useSelector(
    (state) => state.data.campus.logoBackground
  );
  const aspectRatio = useSelector((state) => state.data.campus.aspectRatio);
  const hasNotification = useSelector(
    (state) => state.user.notificationAvailable
  );

  const [isUserFirstTime, setIsUserFirstTime] = useState(false);

  //show user's name, intake... photo, and notifications icon

  const [menuItems] = useState([
    { name: "home" },
    { name: "clubs" },
    { name: "orientation" },
    { name: "general forms" },
    { name: "account" },
  ]);

  const handleMenuNavigation = (name) => {
    const menuItem = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === "staff list") navigation.replace("Stafflist");
    else if (name === "general forms") navigation.replace("GeneralForms");
    else if (name === "home") navigation.replace("Feed");
    else navigation.replace(menuItem.trim());
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user && isEmpty(state.credentials) && !loading) {
        dispatch(getAuthenticatedUser(user.email));
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user.name)
      Toast.show({
        type: "neutral",
        text1: `Welcome back, ${user.name}!`,
      });

    if (user.isFirstTime && user.isFirstTime === true) {
      setIsUserFirstTime(true);
      dispatch(setUserFirstTimeToFalse(user.userId));
      dispatch({ type: SHOW_CLUB_ONBOARDING, payload: true });
    }
  }, [user]);

  const userProfileDisplay = loading ? (
    <Loader style={{ marginTop: pixelSizeVertical(200) }} />
  ) : (
    <View
      style={{
        flexDirection: "row",
        marginBottom: pixelSizeVertical(24),
        backgroundColor: "#242997",
        paddingRight: pixelSizeHorizontal(16),
        paddingLeft: pixelSizeHorizontal(16),
        paddingTop: pixelSizeVertical(12),
        paddingBottom: pixelSizeVertical(12),
      }}
    >
      <Pressable onPress={() => navigation.replace("Profile")}>
        <FastImage
          style={styles.image}
          resizeMode="cover"
          source={{ uri: user.profileImage }}
          progressiveRenderingEnabled={true}
          cache={FastImage.cacheControl.immutable}
          priority={FastImage.priority.normal}
        />
      </Pressable>
      <Pressable
        style={{
          marginRight: pixelSizeHorizontal(10),
          marginLeft: pixelSizeHorizontal(10),
          maxWidth: "68%",
        }}
        onPress={() => navigation.replace("Profile")}
      >
        <Text
          style={{
            color: "#DFE5F8",
            fontSize: fontPixel(22),
            marginBottom: pixelSizeVertical(2),
            fontWeight: "500",
          }}
        >
          {user.name}
        </Text>
        <Text
          style={{
            color: "#C6CDE2",
            fontSize: fontPixel(14),
            fontWeight: "400",
          }}
        >
          {user.intake}, {user.department}
        </Text>
      </Pressable>
      <Pressable
        style={{
          marginLeft: "auto",
        }}
        onPress={() => navigation.replace("Notifications")}
      >
        {hasNotification ? <Notification_Alert_Icon /> : <Notification_Icon />}
      </Pressable>
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={{
        justifyContent: "center",
        paddingTop: pixelSizeVertical(50),
        paddingBottom: pixelSizeVertical(16),
      }}
      style={styles.container}
    >
      <IosHeight />
      <View style={styles.list}>
        {/* {!loading ? <Text style={styles.college}>{user.campus}</Text> : null} */}
        {!loading && !dataLoading ? (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: pixelSizeVertical(24),
              backgroundColor: logoBackground,
              paddingRight: pixelSizeHorizontal(16),
              paddingLeft: pixelSizeHorizontal(16),
              paddingTop: pixelSizeVertical(12),
              paddingBottom: pixelSizeVertical(12),
            }}
          >
            <FastImage
              style={{
                flex: 2,
                aspectRatio: aspectRatio,
              }}
              resizeMode="contain"
              source={{ uri: campusLogo }}
              progressiveRenderingEnabled={true}
              cache={FastImage.cacheControl.immutable}
              priority={FastImage.priority.high}
            />
          </View>
        ) : null}
        {userProfileDisplay}
        {!loading && !dataLoading ? (
          <FlatList
            style={{
              paddingRight: pixelSizeHorizontal(16),
              paddingLeft: pixelSizeHorizontal(16),
            }}
            scrollEnabled={false}
            keyExtractor={(item, index) => index.toString()}
            data={menuItems}
            renderItem={({ item }) => (
              <Pressable
                disabled={loading || dataLoading}
                onPress={() => handleMenuNavigation(item.name)}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.menuItems}>{item.name}</Text>
                  {item.name === "account" && isUserFirstTime && (
                    <RedDot style={{ marginBottom: 40 }} />
                  )}
                </View>
              </Pressable>
            )}
          />
        ) : null}
      </View>
      {!loading && !dataLoading ? (
        <Text style={styles.version}>v 1.0.6</Text>
      ) : null}
      <Toast config={toastConfig} />
      <StatusBar style="light" translucent={false} backgroundColor="#363BB1" />
      <EmptyView backgroundColor={"#363BB1"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#363BB1",
  },
  list: {
    marginBottom: pixelSizeVertical(32),
  },
  menuItems: {
    color: "#07BEB8",
    fontSize: fontPixel(52),
    marginBottom: pixelSizeVertical(25),
    textTransform: "lowercase",
    fontWeight: "400",
  },
  name: {
    color: "#C6CDE2",
    fontSize: fontPixel(36),
    marginTop: pixelSizeVertical(-50),
    fontWeight: "400",
  },
  college: {
    color: "#DFE5F8",
    fontSize: fontPixel(18),
    marginBottom: pixelSizeVertical(24),
    fontWeight: "400",
    textAlign: "center",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  image: {
    width: widthPixel(60),
    height: heightPixel(60),
    marginTop: "auto",
    marginBottom: "auto",
    borderRadius: 50,
  },
  version: {
    fontSize: fontPixel(14),
    fontWeight: "400",
    opacity: 0.5,
    color: "#C6CDE2",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
});
