import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TextInput,
  ScrollView,
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

import SelectDropdown from "react-native-select-dropdown";

import Header from "../components/Header";

const { width } = Dimensions.get("window");

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { assignNewClubRole } from "../src/redux/actions/dataActions";

export default function EditClubMember({ navigation, route }) {
  const { member } = route.params;
  const dispatch = useDispatch();
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const club = useSelector((state) => state.data.clubData.club);
  const loading = useSelector((state) => state.data.loading);
  const campusID = useSelector((state) => state.data.campus.campusID);

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [errors, setErrors] = useState({ role: undefined });

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [showAssignRolePopUp, setShowAssignRolePopUp] = useState(false);
  const [showRoleWarningPopUp, setShowRoleWarningPopUp] = useState(false);

  useEffect(() => {
    let temp = [...Object.values(club.roles)];
    let arr = [];
    temp.forEach((role) => {
      arr.push(role.name);
    });
    setRoles([...arr]);
  }, [club.roles]);

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

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  const handleShowAssignRolePopUp = () => {
    setShowAssignRolePopUp(!showAssignRolePopUp);
  };

  //create new roles
  //delete created roles

  const handleAssignRole = () => {
    //if role being assigned belongs to another member, show warning message
    let role = selectedRole.split(" ").join("");
    if (selectedRole !== "member" && club.roles[role].userID !== "")
      handleShowRoleWarningPopUp();
    else {
      let newMember = {
        userID: member.userID,
        memberID: member.memberID,
      };
      if (member.role === "member")
        dispatch(
          assignNewClubRole(
            selectedRole,
            newMember,
            club.clubID,
            undefined,
            undefined,
            false
          )
        );
      else {
        dispatch(
          assignNewClubRole(
            selectedRole,
            newMember,
            club.clubID,
            undefined,
            member.role,
            false
          )
        );
      }
      handleShowAssignRolePopUp();
      setSelectedRole("");
    }
  };

  const handleShowRoleWarningPopUp = () => {
    setShowRoleWarningPopUp(!showRoleWarningPopUp);
  };

  const handleAssignCommitteeRole = () => {
    let newMember = {
      userID: member.userID,
      memberID: member.memberID,
    };
    let role = selectedRole.split(" ").join("");
    let prevMember = {
      userID: club.roles[role].userID,
      memberID: club.roles[role].memberID,
    };
    dispatch(
      assignNewClubRole(
        selectedRole,
        newMember,
        club.clubID,
        prevMember,
        undefined,
        false
      )
    );
    handleShowRoleWarningPopUp();
    handleShowAssignRolePopUp();
    setSelectedRole("");
    if (selectedRole === "president")
      navigation.replace("ClubsPages", { clubID: club.clubID });
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
              {member.name}
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
              <Header header={member.name} />
            </View>
            <Text style={styles.disclaimer}>{member.role}</Text>
            <Image
              style={styles.image}
              contentFit="cover"
              source={member.profileImage}
            />
            <Text
              style={{
                fontSize: fontPixel(20),
                fontWeight: "400",
                color: "#DFE5F8",
                marginTop: pixelSizeVertical(12),
              }}
            >
              {member.email}
            </Text>
            <Text
              style={{
                fontSize: fontPixel(20),
                fontWeight: "400",
                color: "#DFE5F8",
                marginTop: pixelSizeVertical(6),
                marginBottom: pixelSizeVertical(24),
              }}
            >
              {member.phone_number
                ? member.phone_number
                : "phone number not available"}
            </Text>
            <Pressable
              style={loading ? styles.loginButtonDisabled : styles.loginButton}
              onPress={handleShowAssignRolePopUp}
            >
              <Text
                style={
                  loading
                    ? styles.loginButtonLoadingText
                    : styles.loginButtonText
                }
              >
                {loading ? "assigning role..." : "assign role"}
              </Text>
            </Pressable>
            {member.name !== currentMember.name && (
              <Pressable
                onPress={() => {
                  navigation.goBack();
                }}
                disabled={loading}
              >
                <Text style={styles.secondaryButton}>deactivate</Text>
              </Pressable>
            )}
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
        isVisible={showAssignRolePopUp}
        onBackdropPress={handleShowAssignRolePopUp} // Android back press
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
            {`Assign new role for ${member.name}`}
          </Text>
          <SelectDropdown
            search={true}
            searchInputStyle={{
              backgroundColor: "#232D4A",
            }}
            disabled={loading}
            searchPlaceHolder="select new role"
            searchInputTxtColor="#DFE5F8"
            defaultButtonText={`current role: ${member.role}`}
            showsVerticalScrollIndicator={true}
            buttonStyle={{
              backgroundColor: "#1A2238",
              marginTop: pixelSizeVertical(10),
              height: heightPixel(58),
              width: "100%",
              borderRadius: 5,
            }}
            buttonTextStyle={{
              fontSize: fontPixel(16),
              fontWeight: "400",
              color: "#DFE5F8",
              textAlign: "left",
            }}
            dropdownStyle={{
              backgroundColor: "#1A2238",
              borderRadius: 5,
            }}
            rowStyle={{
              backgroundColor: "#1A2238",
              borderBottomWidth: 0,
            }}
            rowTextStyle={{
              fontSize: fontPixel(16),
              fontWeight: "400",
              color: "#DFE5F8",
              textAlign: "left",
            }}
            selectedRowStyle={{
              backgroundColor: "#C4FFF9",
            }}
            selectedRowTextStyle={{
              color: "#0C111F",
              fontSize: fontPixel(16),
              fontWeight: "400",
              textAlign: "left",
            }}
            data={roles.filter(
              (role) =>
                role.split(" ").join("") !== member.role.split(" ").join("")
            )}
            onSelect={(selectedItem, index) => {
              setSelectedRole(selectedItem);
            }}
          />
          {errors.role ? <Text style={styles.error}>{errors.role}</Text> : null}

          <Pressable
            disabled={loading || !selectedRole}
            style={
              loading || !selectedRole
                ? styles.loginButtonDisabled
                : styles.loginButton
            }
            onPress={handleAssignRole}
          >
            <Text
              style={
                loading || !selectedRole
                  ? styles.loginButtonLoadingText
                  : styles.loginButtonText
              }
            >
              {loading ? "assigning..." : "assign"}
            </Text>
          </Pressable>
          {!loading && (
            <Pressable onPress={handleShowAssignRolePopUp}>
              <Text style={styles.withdrawButton}>cancel</Text>
            </Pressable>
          )}
        </View>
      </Modal>

      <Modal
        isVisible={showRoleWarningPopUp}
        onBackdropPress={handleShowRoleWarningPopUp} // Android back press
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
            {selectedRole === "president"
              ? "Assigning this member the President's role will remove your role as a president and reassign your role as a member. Do you wish to continue?"
              : "Reassigning this role will reset the previous member's role. Do you wish to continue?"}
          </Text>
          <Pressable
            style={loading ? styles.loginButtonDisabled : styles.loginButton}
            onPress={handleAssignCommitteeRole}
          >
            <Text
              style={
                loading ? styles.loginButtonLoadingText : styles.loginButtonText
              }
            >
              continue
            </Text>
          </Pressable>
          {!loading && (
            <Pressable onPress={handleShowRoleWarningPopUp}>
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
    marginTop: pixelSizeVertical(20),
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
    marginTop: pixelSizeVertical(24),
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
