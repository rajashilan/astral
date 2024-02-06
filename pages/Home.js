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
import { getAuthenticatedUser } from "../src/redux/actions/userActions";
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

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  const loading = useSelector((state) => state.user.loading);
  const user = useSelector((state) => state.user.credentials);
  const hasNotification = useSelector(
    (state) => state.user.notificationAvailable
  );

  const [show, setShow] = useState(false);

  //show user's name, intake... photo, and notifications icon

  const [menuItems] = useState([
    { name: "orientation" },
    { name: "clubs" },
    { name: "general forms" },
    { name: "profile" },
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 160);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleMenuNavigation = (name) => {
    const menuItem = name.charAt(0).toUpperCase() + name.slice(1);
    if (name === "staff list") navigation.replace("Stafflist");
    else if (name === "general forms") navigation.replace("GeneralForms");
    else navigation.replace(menuItem.trim());
  };

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  useEffect(() => {
    if (show) {
      auth().onAuthStateChanged((user) => {
        if (user && isEmpty(state.credentials) && !loading) {
          dispatch(getAuthenticatedUser(user.email));
        }
      });
    }
  }, [show]);

  useEffect(() => {
    if (user.name)
      Toast.show({
        type: "neutral",
        text1: `Welcome back, ${user.name}!`,
      });
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
        }}
        onPress={() => navigation.replace("Profile")}
      >
        <Text
          style={{
            color: "#DFE5F8",
            fontSize: fontPixel(22),
            marginBottom: pixelSizeVertical(2),
            fontWeight: "500",
            maxWidth: "84%",
          }}
        >
          {user.name}
        </Text>
        <Text
          style={{
            color: "#C6CDE2",
            fontSize: fontPixel(14),
            fontWeight: "400",
            maxWidth: "94%",
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
        paddingTop: pixelSizeVertical(80),
        paddingBottom: pixelSizeVertical(16),
      }}
      style={styles.container}
    >
      <IosHeight />
      <View style={styles.list}>
        {!loading ? <Text style={styles.college}>{user.campus}</Text> : null}
        {userProfileDisplay}
        {!loading ? (
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
                disabled={loading}
                onPress={() => handleMenuNavigation(item.name)}
              >
                <Text style={styles.menuItems}>{item.name}</Text>
              </Pressable>
            )}
          />
        ) : null}
      </View>
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
});
