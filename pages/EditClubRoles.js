import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  FlatList,
  ScrollView,
  TextInput,
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

const { width } = Dimensions.get("window");

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useNavigationState } from "@react-navigation/native";
import {
  addNewClubRole,
  deleteClubRole,
} from "../src/redux/actions/dataActions";

export default function EditClubRoles({ navigation }) {
  const dispatch = useDispatch();
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const club = useSelector((state) => state.data.clubData.club);
  const loading = useSelector((state) => state.data.loading);
  const campusID = useSelector((state) => state.data.campus.campusID);
  const [roles, setRoles] = useState([
    "president",
    "vice president",
    "secretary",
    "treasurer",
    "member",
  ]);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [showDeletePopUp, setShowDeletePopUp] = useState(false);
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [newRole, setNewRole] = useState("");
  const [errors, setErrors] = useState({ role: undefined });
  const [deleteRole, setDeleteRole] = useState("");

  const onLayout = (event) => {
    const { x, y, height, width } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  useEffect(() => {
    let temp = [...Object.values(club.roles)];
    let arr = [...roles];
    temp.forEach((role) => {
      if (!roles.includes(role.name)) arr.push(role.name);
    });
    setRoles([...arr]);
  }, [club]);

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

  const handleShowAddPopUp = () => {
    setShowAddPopUp(!showAddPopUp);
    setNewRole("");
  };
  const handleShowDeletePopUp = (item) => {
    setShowDeletePopUp(!showDeletePopUp);
    if (item) setDeleteRole(item);
    else setDeleteRole("");
  };

  const handleDeleteRole = () => {
    let temp = deleteRole.split(" ").join("");
    dispatch(deleteClubRole(temp, club.clubID));

    handleShowDeletePopUp();
    setDeleteRole("");
  };

  const handleAddRole = () => {
    let temp = newRole.toLowerCase();
    temp = temp.split(" ").join("");
    let errors = [...errors];

    if (temp === "") errors.role = "please enter a new role";
    if (roles.includes(temp))
      errors.role = "cannot enter a role that already exists";

    if (!errors.role) {
      dispatch(addNewClubRole(temp, newRole.toLowerCase(), club.clubID));
      handleShowAddPopUp();
    }

    setErrors(errors);
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
        {showMiniHeader ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
          >
            <Text style={styles.headerMini} numberOfLines={1}>
              edit roles
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
        stickyHeaderIndices={[1]}
        onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      >
        <View style={styles.paddingContainer}>
          <View style={{ width: "100%", flexDirection: "column" }}>
            <View onLayout={onLayout}>
              <Header header={"edit roles"} />
            </View>
            <Text style={styles.disclaimer}>{club.name}</Text>
            <Text
              style={{
                fontSize: fontPixel(22),
                fontWeight: "500",
                color: "#DFE5F8",
                marginTop: pixelSizeVertical(16),
                marginBottom: pixelSizeVertical(8),
              }}
            >
              current roles
            </Text>
            <FlatList
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={roles}
              renderItem={({ item }) => (
                <>
                  <Pressable
                    disabled={
                      item === "president" ||
                      item === "vicepresident" ||
                      item === "treasurer" ||
                      item === "secretary" ||
                      item === "member"
                    }
                    onPress={() => {
                      handleShowDeletePopUp(item);
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#232F52",
                        width: "100%",
                        borderRadius: 5,
                        paddingTop: pixelSizeVertical(14),
                        paddingBottom: pixelSizeVertical(14),
                        paddingRight: pixelSizeHorizontal(12),
                        paddingLeft: pixelSizeHorizontal(12),
                        marginBottom: pixelSizeVertical(10),
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: fontPixel(18),
                          fontWeight: "400",
                          color: "#DFE5F8",
                        }}
                      >
                        {item}
                      </Text>
                      {item === "president" ||
                        item === "vice president" ||
                        item === "treasurer" ||
                        item === "secretary" ||
                        (item !== "member" && (
                          <Text
                            style={{
                              fontSize: fontPixel(18),
                              fontWeight: "800",
                              color: "#A3222D",
                            }}
                          >
                            &#10005;
                          </Text>
                        ))}
                    </View>
                  </Pressable>
                </>
              )}
            />
            <Pressable
              disabled={loading}
              style={loading ? styles.loginButtonDisabled : styles.loginButton}
              onPress={handleShowAddPopUp}
            >
              <Text
                style={
                  loading
                    ? styles.loginButtonLoadingText
                    : styles.loginButtonText
                }
              >
                {loading ? "adding new role..." : "add new role"}
              </Text>
            </Pressable>
          </View>
        </View>
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
          currentPage={"clubs"}
          navigation={navigation}
        />
      </Modal>
      <Modal
        isVisible={showAddPopUp}
        onBackdropPress={handleShowAddPopUp} // Android back press
        animationIn="bounceIn" // Has others, we want slide in from the left
        animationOut="bounceOut" // When discarding the drawer
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.withdrawPopupStyle} // Needs to contain the width, 75% of screen width in our case
      >
        <View style={styles.withdrawMenu}>
          <Text
            style={{
              fontSize: fontPixel(20),
              fontWeight: "400",
              color: "#DFE5F8",
              marginBottom: pixelSizeVertical(12),
              textAlign: "center",
            }}
          >
            add a new role
          </Text>

          <TextInput
            style={styles.textInput}
            placeholder="enter new role"
            placeholderTextColor="#DBDBDB"
            value={newRole}
            editable={!loading}
            onChangeText={(role) => setNewRole(role)}
          />
          {errors.role ? <Text style={styles.error}>{errors.role}</Text> : null}

          <Pressable
            disabled={loading}
            style={loading ? styles.loginButtonDisabled : styles.loginButton}
            onPress={handleAddRole}
          >
            <Text
              style={
                loading ? styles.loginButtonLoadingText : styles.loginButtonText
              }
            >
              {loading ? "adding new role..." : "add"}
            </Text>
          </Pressable>
          {!loading && (
            <Pressable onPress={handleShowAddPopUp}>
              <Text style={styles.withdrawButton}>cancel</Text>
            </Pressable>
          )}
        </View>
      </Modal>
      <Modal
        isVisible={showDeletePopUp}
        onBackdropPress={handleShowDeletePopUp} // Android back press
        animationIn="bounceIn" // Has others, we want slide in from the left
        animationOut="bounceOut" // When discarding the drawer
        useNativeDriver // Faster animation
        hideModalContentWhileAnimating // Better performance, try with/without
        propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
        style={styles.withdrawPopupStyle} // Needs to contain the width, 75% of screen width in our case
      >
        <View style={styles.withdrawMenu}>
          <Text
            style={{
              fontSize: fontPixel(20),
              fontWeight: "400",
              color: "#DFE5F8",
              marginBottom: pixelSizeVertical(12),
              textAlign: "center",
            }}
          >
            {` are you sure to delete the "${deleteRole}" role?`}
          </Text>

          <Pressable
            disabled={loading}
            style={loading ? styles.loginButtonDisabled : styles.loginButton}
            onPress={handleDeleteRole}
          >
            <Text
              style={
                loading ? styles.loginButtonLoadingText : styles.loginButtonText
              }
            >
              {loading ? "deleting role..." : "delete"}
            </Text>
          </Pressable>
          {!loading && (
            <Pressable onPress={handleShowDeletePopUp}>
              <Text style={styles.withdrawButton}>cancel</Text>
            </Pressable>
          )}
        </View>
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
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(32),
    backgroundColor: "#0C111F",
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
  image: {
    width: "100%",
    height: heightPixel(280),
    marginBottom: pixelSizeVertical(12),
    borderRadius: 5,
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
    backgroundColor: "#212A46",
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
  withdrawMenu: {
    height: "auto",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    backgroundColor: "#131A2E",
    display: "flex",
    borderRadius: 5,
  },
  withdrawButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
  },
});
