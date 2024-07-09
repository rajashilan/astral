import FastImage from "react-native-fast-image";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import SelectDropdown from "react-native-select-dropdown";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";

import hamburgerIcon from "../assets/hamburger_icon.png";
import Header from "../components/Header";
import IosHeight from "../components/IosHeight";
import SideMenu from "../components/SideMenu";
import {
  assignNewClubRole,
  deactivateClubMember,
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

const { width } = Dimensions.get("window");

export default function EditClubMember({ navigation, route }) {
  const { member } = route.params;
  const dispatch = useDispatch();
  const currentMember = useSelector(
    (state) => state.data.clubData.currentMember
  );
  const club = useSelector((state) => state.data.clubData.club);
  const loading = useSelector((state) => state.data.loading);
  //const loading = true;

  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [errors] = useState({ role: undefined });

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [showAssignRolePopUp, setShowAssignRolePopUp] = useState(false);
  const [showRoleWarningPopUp, setShowRoleWarningPopUp] = useState(false);

  const [showDeactivateMemberPopUp, setShowDeactivateMemberPopUp] =
    useState(false);

  const [showPresidentRoleWarningPopUp, setShowPresidentRoleWarningPopUp] =
    useState(false);

  useEffect(() => {
    const temp = [...Object.values(club.roles)];
    const arr = [];
    temp.forEach((role) => {
      arr.push(role.name);
    });
    setRoles([...arr]);
  }, [club.roles]);

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

  const handleNavigateBack = () => {
    navigation.goBack();
  };

  //the basic first pop up
  const handleShowAssignRolePopUp = () => {
    setSelectedRole("");
    setShowAssignRolePopUp(!showAssignRolePopUp);
  };

  //basic deactivate member pop up
  const handleShowDeactivateMemberPopUp = () => {
    setShowDeactivateMemberPopUp(!showDeactivateMemberPopUp);
  };

  //assign role pop up -> this pop up
  const handleShowPresidentRoleWarningPopUp = () => {
    setShowPresidentRoleWarningPopUp(!showPresidentRoleWarningPopUp);
  };

  //assign role pop up -> this pop up
  const handleShowRoleWarningPopUp = () => {
    setShowRoleWarningPopUp(!showRoleWarningPopUp);
  };

  //create new roles
  //delete created roles

  const handleAssignRole = () => {
    // Remove spaces from the selected role
    const role = selectedRole.replace(/\s+/g, "");

    console.log(role, club.roles[role]?.userID);

    // Show warnings based on role conditions
    if (member.role === "president") {
      handleShowPresidentRoleWarningPopUp();
    } else if (selectedRole !== "member" && club.roles[role]?.userID) {
      handleShowRoleWarningPopUp();
    } else {
      const newMember = {
        userID: member.userID,
        memberID: member.memberID,
        role: member.role,
      };

      console.log(newMember);

      // Determine if the current member has a role other than "member"
      const currentRole = member.role === "member" ? undefined : member.role;

      // Dispatch the action to assign a new role
      dispatch(
        assignNewClubRole(
          selectedRole,
          newMember,
          club.clubID,
          undefined,
          currentRole,
          false
        )
      );

      // Show the assign role pop-up and reset the selected role
      handleShowAssignRolePopUp();
      setSelectedRole("");
    }
  };

  //handles when the role is currently assigned to another user
  const handleAssignCommitteeRole = () => {
    const newMember = {
      userID: member.userID,
      memberID: member.memberID,
      role: member.role,
    };
    const role = selectedRole.split(" ").join("");
    const prevMember = {
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

  const handleDeactivateMember = () => {
    //if the member's role is not member, set the role to member
    if (member.role !== "member") {
      const newMember = {
        userID: member.userID,
        memberID: member.memberID,
      };
      dispatch(
        assignNewClubRole(
          "member",
          newMember,
          club.clubID,
          undefined,
          member.role,
          true
        )
      );
    }

    dispatch(deactivateClubMember(member.userID, club.clubID));
    navigation.replace("ClubCurrentMembers");
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
              <Header header={member.name} />
            </View>
            <Text style={styles.disclaimer}>{member.role}</Text>
            <FastImage
              style={styles.image}
              resizeMode="cover"
              source={{ uri: member.profileImage }}
              progressiveRenderingEnabled={true}
              cache={FastImage.cacheControl.immutable}
              priority={FastImage.priority.normal}
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
                fontSize: member.phone_number ? fontPixel(20) : fontPixel(16),
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
            <PrimaryButton
              loading={loading}
              onPress={handleShowAssignRolePopUp}
              text="assign role"
            />
            {member.name !== currentMember.name && !loading && (
              <Pressable
                onPress={handleShowDeactivateMemberPopUp}
                disabled={loading}
              >
                <Text style={styles.secondaryButton}>remove</Text>
              </Pressable>
            )}
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
            search
            searchInputStyle={{
              backgroundColor: "#232D4A",
            }}
            disabled={loading}
            searchPlaceHolder="select new role"
            searchInputTxtColor="#DFE5F8"
            defaultButtonText={`current role: ${member.role}`}
            showsVerticalScrollIndicator
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
          <PrimaryButton
            conditionToDisable={!selectedRole}
            loading={loading}
            text="assign"
            onPress={handleAssignRole}
          />
          {!loading && (
            <Pressable onPress={handleShowAssignRolePopUp}>
              <Text style={styles.withdrawButton}>cancel</Text>
            </Pressable>
          )}
        </View>
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
            <PrimaryButton
              loading={loading}
              text="continue"
              onPress={handleAssignCommitteeRole}
            />
            {!loading && (
              <Pressable onPress={handleShowRoleWarningPopUp}>
                <Text style={styles.withdrawButton}>cancel</Text>
              </Pressable>
            )}
          </View>
        </Modal>
        <Modal
          isVisible={showPresidentRoleWarningPopUp}
          onBackdropPress={handleShowPresidentRoleWarningPopUp} // Android back press
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
              To change your role as president, appoint a new member as the club
              president first.
            </Text>
            <PrimaryButton
              loading={loading}
              onPress={handleShowPresidentRoleWarningPopUp}
              text={"Ok"}
            />
          </View>
        </Modal>
      </Modal>

      <Modal
        isVisible={showDeactivateMemberPopUp}
        onBackdropPress={handleShowDeactivateMemberPopUp} // Android back press
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
            are you sure to remove this member?
          </Text>
          <PrimaryButton
            loading={loading}
            onPress={handleDeactivateMember}
            text={"remove"}
          />
          {!loading && (
            <Pressable onPress={handleShowDeactivateMemberPopUp}>
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
  image: {
    width: "100%",
    height: heightPixel(280),
    marginTop: pixelSizeVertical(24),
    marginBottom: pixelSizeVertical(12),
    borderRadius: 5,
  },
  disclaimer: {
    marginTop: pixelSizeVertical(-18),
    fontSize: fontPixel(20),
    fontWeight: "400",
    color: "#C6CDE2",
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
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#A7AFC7",
    marginTop: pixelSizeVertical(2),
    textAlign: "center",
  },
});
