import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  TextInput,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import SegmentedPicker from "react-native-segmented-picker";

import {
  fontPixel,
  widthPixel,
  heightPixel,
  pixelSizeVertical,
  pixelSizeHorizontal,
} from "../utils/responsive-font";

import hamburgerIcon from "../assets/hamburger_icon.png";
import SideMenu from "../components/SideMenu";
import Modal from "react-native-modal";
import { Image } from "expo-image";

import IosHeight from "../components/IosHeight";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function Stafflist({ navigation }) {
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(false);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterBy, setFilterBy] = useState("");
  const [search, setSearch] = useState("");

  const [headerHeight, setHeaderHeight] = useState(300);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [showMiniHeader, setShowMiniHeader] = useState(false);

  const [departments, setDepartments] = useState([
    {
      name: "Engineering and IT",
    },
    {
      name: "Hospitality and Tourism",
    },
    {
      name: "Nursing Department",
    },
    {
      name: "Culinary Arts",
    },
  ]);

  const [staffList, setStaffList] = useState([
    {
      name: "Ms. Koo Lee Chun",
      department: "Engineering and IT",
      contactDetails: [
        {
          email: "koo.lee.chun@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [
            {
              item: "Monday 2pm-4pm",
            },
            {
              item: "Wednesday 1pm-5pm",
            },
            {
              item: "Friday 1pm-3pm",
            },
          ],
        },
      ],
    },
    {
      name: "Ms. Usha Jayahkudy",
      department: "Hospitality and Tourism",
      contactDetails: [
        {
          email: "usha@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [
            {
              item: "Monday 2pm-4pm",
            },
            {
              item: "Wednesday 1pm-5pm",
            },
          ],
        },
      ],
    },
    {
      name: "Mr. An example of a very very long name",
      department: "Nursing Department",
      contactDetails: [
        {
          email: "longname@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [],
        },
      ],
    },
    {
      name: "Mr. Damian",
      department: "Culinary Arts",
      contactDetails: [
        {
          email: "damian@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [
            {
              item: "Monday 2pm-4pm",
            },
          ],
        },
      ],
    },
    {
      name: "Ms. Another one",
      department: "Engineering and IT",
      contactDetails: [
        {
          email: "koo.lee.chun@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [
            {
              item: "Monday 2pm-4pm",
            },
            {
              item: "Wednesday 1pm-5pm",
            },
            {
              item: "Friday 1pm-3pm",
            },
          ],
        },
      ],
    },
    {
      name: "Ms. Usha Jayahkudy",
      department: "Hospitality and Tourism",
      contactDetails: [
        {
          email: "usha@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [
            {
              item: "Monday 2pm-4pm",
            },
            {
              item: "Wednesday 1pm-5pm",
            },
          ],
        },
      ],
    },
    {
      name: "Mr. An example of a very very long name",
      department: "Nursing Department",
      contactDetails: [
        {
          email: "longname@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [],
        },
      ],
    },
    {
      name: "Mr. Damian",
      department: "Culinary Arts",
      contactDetails: [
        {
          email: "damian@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [
            {
              item: "Monday 2pm-4pm",
            },
          ],
        },
      ],
    },
    {
      name: "Mr. DJ Khaled",
      department: "Engineering and IT",
      contactDetails: [
        {
          email: "koo.lee.chun@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [
            {
              item: "Monday 2pm-4pm",
            },
            {
              item: "Wednesday 1pm-5pm",
            },
            {
              item: "Friday 1pm-3pm",
            },
          ],
        },
      ],
    },
    {
      name: "Ms. Usha Jayahkudy",
      department: "Hospitality and Tourism",
      contactDetails: [
        {
          email: "usha@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [
            {
              item: "Monday 2pm-4pm",
            },
            {
              item: "Wednesday 1pm-5pm",
            },
          ],
        },
      ],
    },
    {
      name: "Mr. An example of a very very long name",
      department: "Nursing Department",
      contactDetails: [
        {
          email: "longname@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [],
        },
      ],
    },
    {
      name: "Mr. Damian",
      department: "Culinary Arts",
      contactDetails: [
        {
          email: "damian@newinti.edu.my",
          contact: "+60178229871",
          availableHours: [
            {
              item: "Monday 2pm-4pm",
            },
          ],
        },
      ],
    },
  ]);

  const toggleSideMenu = () => {
    setIsSideMenuVisible(!isSideMenuVisible);
  };

  const toggleFilterMenu = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const clearFilter = () => {
    setFilterBy("");
  };

  let filterButton =
    filterBy === "" ? (
      <Pressable
        onPress={toggleFilterMenu}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.filterButton}>filter</Text>
      </Pressable>
    ) : (
      <Pressable
        onPress={clearFilter}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.filterButton}>clear filter</Text>
      </Pressable>
    );

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

  return (
    <View style={styles.container}>
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
              staff list
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
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        stickyHeaderIndices={[1]}
        onScroll={(event) => setScrollHeight(event.nativeEvent.contentOffset.y)}
      >
        <View style={styles.headerBottomContainer} onLayout={onLayout}>
          <Text style={styles.header}>staff list</Text>
          {filterButton}
        </View>

        <View
          style={{
            backgroundColor: "#0C111F",
          }}
        >
          <TextInput
            style={styles.textInput}
            placeholder="Search"
            placeholderTextColor="#DBDBDB"
            onChangeText={(newSearch) => setSearch(newSearch)}
          />
        </View>
        <FlatList
          scrollEnabled={false}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={
            filterBy === "" && search === ""
              ? staffList
              : filterBy !== "" && search === ""
              ? staffList.filter((s) => s.department === filterBy)
              : filterBy === "" && search !== ""
              ? staffList.filter((s) =>
                  s.name.toLowerCase().includes(search.toLowerCase())
                )
              : staffList.filter(
                  (s) =>
                    s.department === filterBy &&
                    s.name.toLowerCase().includes(search.toLowerCase())
                )
          }
          renderItem={({ item }) => (
            <>
              <Pressable
                onPress={() =>
                  navigation.navigate("Stafflistpage", {
                    name: item.name,
                    department: item.department,
                    contact: item.contactDetails,
                  })
                }
              >
                <Text style={styles.pageItems}>{item.name}</Text>
              </Pressable>
              <View style={styles.divider} />
            </>
          )}
        />
      </ScrollView>

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
          currentPage={"staff list"}
          navigation={navigation}
        />
      </Modal>
      <SegmentedPicker
        visible={isFilterVisible}
        confirmTextColor="#C4FFF9"
        toolbarBackgroundColor="#1A2238"
        toolbarBorderColor="#283350"
        pickerItemTextColor="#DFE5F8"
        selectionBackgroundColor="#1A2238"
        selectionBorderColor="#C4FFF9"
        backgroundColor="#1A2238"
        options={[
          {
            key: "col_1",
            items: departments.map((department) => ({
              label: department.name,
              value: department.name,
            })),
          },
        ]}
        onValueChange={({ column, value }) => {
          setFilterBy(value);
        }}
        onCancel={(selections) => {
          setFilterBy("");
          toggleFilterMenu();
        }}
        onConfirm={(selections) => {
          if (filterBy === "") {
            setFilterBy(departments[0].name);
          }
          toggleFilterMenu();
        }}
      />
      <StatusBar style="light" translucent={false} backgroundColor="#0C111F" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C111F",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
  },
  header: {
    fontSize: fontPixel(42),
    fontWeight: "400",
    color: "#DFE5F8",
    marginTop: pixelSizeVertical(14),
  },
  sideMenuStyle: {
    margin: 0,
    width: width * 0.85, // SideMenu width
    alignSelf: "flex-end",
  },
  headerContainer: {
    marginTop: pixelSizeVertical(20),
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  headerBottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  hamburgerIcon: {
    height: pixelSizeVertical(20),
    width: pixelSizeHorizontal(30),
  },
  textInput: {
    backgroundColor: "#1A2238",
    paddingRight: pixelSizeHorizontal(16),
    paddingLeft: pixelSizeHorizontal(16),
    paddingTop: pixelSizeVertical(16),
    paddingBottom: pixelSizeVertical(16),
    marginTop: pixelSizeVertical(10),
    marginBottom: pixelSizeVertical(18),
    fontSize: fontPixel(16),
    fontWeight: "400",
    color: "#DFE5F8",
    width: "100%",
    borderRadius: 5,
  },
  pageItems: {
    fontSize: fontPixel(28),
    fontWeight: "500",
    color: "#C4FFF9",
    lineHeight: 36,
    marginLeft: pixelSizeVertical(2),
    marginRight: pixelSizeVertical(2),
    marginBottom: pixelSizeVertical(12),
  },
  divider: {
    borderBottomColor: "#283350",
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: pixelSizeVertical(12),
  },
  filterButton: {
    fontSize: fontPixel(22),
    fontWeight: "500",
    color: "#C4FFF9",
    marginBottom: pixelSizeVertical(5),
  },
  emptyView: {
    flex: 1,
    height: pixelSizeVertical(30),
    backgroundColor: "#0C111F",
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
  },
  headerContainerHideMiniHeader: {
    marginTop: pixelSizeVertical(20),
    marginBottom: pixelSizeVertical(8),
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
