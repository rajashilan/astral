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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  addNewClubRole,
  deleteClubRole,
} from "../src/redux/actions/dataActions";
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

const { width } = Dimensions.get("window");

export default function EditClubRoles({ navigation }) {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.data.clubData.members);
  const club = useSelector((state) => state.data.clubData.club);
  const loading = useSelector((state) => state.data.loading);
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
  const [showWarningPopUp, setShowWarningPopUp] = useState(false);
  const [warningPopUpData, setWarningPopUpData] = useState("");
  const [newRole, setNewRole] = useState("");
  const [errors, setErrors] = useState({ role: undefined });
  const [deleteRole, setDeleteRole] = useState("");

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  useEffect(() => {
    if (club.roles) {
      const temp = [...Object.values(club.roles)];
      const arr = [...roles];
      temp.forEach((role) => {
        if (!roles.includes(role.name)) arr.push(role.name);
      });
      setRoles([...arr]);
    }
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
  const handleShowWarningPopUp = (item) => {
    setShowWarningPopUp(!showWarningPopUp);
    if (item) {
      setWarningPopUpData(item);
    } else setWarningPopUpData("");
  };

  const handleDeleteRole = () => {
    const temp = deleteRole.split(" ").join("");

    //check if role to delete has a member in it
    //if yes, cancel out and show pop up

    let warning = false;

    members.forEach((member) => {
      if (member.role === deleteRole) {
        handleShowWarningPopUp(member.name);
        handleShowDeletePopUp();
        warning = true;
      }
    });

    if (!warning) {
      dispatch(deleteClubRole(temp, club.clubID));

      handleShowDeletePopUp();
      setDeleteRole("");
    }
  };

  const handleAddRole = () => {
    let temp = newRole.toLowerCase();
    temp = temp.split(" ").join("");
    const errors = { ...errors };

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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 16 : 0}
      style={styles.container}
    >
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
          <FastImage
            style={styles.hamburgerIcon}
            source={hamburgerIcon}
            resizeMode="contain"
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
              <Header header="edit roles" />
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
              initialNumToRender={10}
              maxToRenderPerBatch={10}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              data={roles}
              renderItem={({ item }) => (
                <>
                  <Pressable
                    disabled={
                      item === "president" ||
                      item === "vice president" ||
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
                              color: "#ed3444",
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
            <PrimaryButton
              loading={loading}
              onPress={handleShowAddPopUp}
              text="add new role"
            />
          </View>
        </View>
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
          <CustomTextInput
            placeholder="enter new role"
            value={newRole}
            editable={!loading}
            onChangeText={(role) => setNewRole(role)}
            inputStyle={{ backgroundColor: "#212A46" }}
          />
          {errors.role ? <Text style={styles.error}>{errors.role}</Text> : null}
          <PrimaryButton loading={loading} onPress={handleAddRole} text="add" />
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
          <PrimaryButton
            loading={loading}
            onPress={handleDeleteRole}
            text="delete"
          />
          {!loading && (
            <Pressable onPress={handleShowDeletePopUp}>
              <Text style={styles.withdrawButton}>cancel</Text>
            </Pressable>
          )}
        </View>
      </Modal>

      <Modal
        isVisible={showWarningPopUp}
        onBackdropPress={handleShowWarningPopUp} // Android back press
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
            {`Role currently assigned to ${warningPopUpData}. Reassign them as a regular member before deleting this role.`}
          </Text>

          <PrimaryButton
            loading={loading}
            onPress={handleShowWarningPopUp}
            text="ok"
          />
        </View>
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
  disclaimer: {
    marginTop: pixelSizeVertical(-18),
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#C6CDE2",
  },
  error: {
    marginTop: pixelSizeVertical(8),
    marginBottom: pixelSizeVertical(8),
    fontSize: fontPixel(12),
    fontWeight: "400",
    color: "#ed3444",
    paddingLeft: pixelSizeHorizontal(16),
    paddingRight: pixelSizeHorizontal(16),
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
    fontSize: fontPixel(18),
    fontWeight: "400",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
  },
});
